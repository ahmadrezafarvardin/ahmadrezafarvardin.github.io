# Sets each page's last-modified date from git history instead of the build time,
# so the sitemap's <lastmod> only changes when a page's content actually changes.
#
# - Pages and project documents get `last_modified_at` (read by jekyll-sitemap).
# - Static files (e.g. the CV PDF) get their modified_time overridden.
# - Pages that list projects (home, /projects/) also count edits to _projects/,
#   because a changed project summary changes what those pages show.
# - Falls back to the file's mtime when git has no history for it
#   (e.g. a new, uncommitted file during local development).
#
# Needs full git history: the deploy workflow checks out with fetch-depth: 0.

require "open3"
require "time"

module GitLastModified
  # Pages whose content is built from the project collection.
  LISTS_PROJECTS = %w[index.html projects.html].freeze

  module_function

  def commit_time(site, *paths)
    out, status = Open3.capture2(
      "git", "-C", site.source, "log", "-1", "--format=%cI", "--", *paths
    )
    return nil unless status.success?

    stamp = out.strip
    stamp.empty? ? nil : Time.iso8601(stamp)
  rescue StandardError
    nil
  end

  def relative(site, path)
    path.sub(%r{\A#{Regexp.escape(site.source)}/?}, "")
  end

  # Page#path is relative to the source; Document#path and StaticFile#path are absolute.
  def date_for(site, path, extra_paths = [])
    rel = relative(site, path)
    commit_time(site, rel, *extra_paths) || File.mtime(File.join(site.source, rel))
  end
end

Jekyll::Hooks.register :site, :post_read do |site|
  site.pages.each do |page|
    next if page.data.key?("last_modified_at")

    extra = GitLastModified::LISTS_PROJECTS.include?(page.relative_path) ? ["_projects"] : []
    page.data["last_modified_at"] = GitLastModified.date_for(site, page.path, extra)
  end

  site.documents.each do |doc|
    next if doc.data.key?("last_modified_at")

    doc.data["last_modified_at"] = GitLastModified.date_for(site, doc.path)
  end

  site.static_files.each do |file|
    file.instance_variable_set(:@modified_time, GitLastModified.date_for(site, file.path))
  end
end
