// get the ninja-keys element
const ninja = document.querySelector('ninja-keys');

// add the home and posts menu items
ninja.data = [{
    id: "nav-about",
    title: "about",
    section: "Navigation",
    handler: () => {
      window.location.href = "/";
    },
  },{id: "nav-projects",
          title: "projects",
          description: "A growing collection of my projects.",
          section: "Navigation",
          handler: () => {
            window.location.href = "/projects/";
          },
        },{id: "nav-cv",
          title: "CV",
          description: "Academic CV of Ahmadreza Farvardin - Mathematics and Computer Science student at University of Tehran",
          section: "Navigation",
          handler: () => {
            window.location.href = "/cv/";
          },
        },{id: "nav-teaching",
          title: "teaching",
          description: "Course materials, schedules, and resources for classes taught.",
          section: "Navigation",
          handler: () => {
            window.location.href = "/teaching/";
          },
        },{id: "post-google-gemini-updates-flash-1-5-gemma-2-and-project-astra",
        
          title: 'Google Gemini updates: Flash 1.5, Gemma 2 and Project Astra <svg width="1.2rem" height="1.2rem" top=".5rem" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg"><path d="M17 13.5v6H5v-12h6m3-3h6v6m0-6-9 9" class="icon_svg-stroke" stroke="#999" stroke-width="1.5" fill="none" fill-rule="evenodd" stroke-linecap="round" stroke-linejoin="round"></path></svg>',
        
        description: "We’re sharing updates across our Gemini family of models and a glimpse of Project Astra, our vision for the future of AI assistants.",
        section: "Posts",
        handler: () => {
          
            window.open("https://blog.google/technology/ai/google-gemini-update-flash-ai-assistant-io-2024/", "_blank");
          
        },
      },{id: "post-displaying-external-posts-on-your-al-folio-blog",
        
          title: 'Displaying External Posts on Your al-folio Blog <svg width="1.2rem" height="1.2rem" top=".5rem" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg"><path d="M17 13.5v6H5v-12h6m3-3h6v6m0-6-9 9" class="icon_svg-stroke" stroke="#999" stroke-width="1.5" fill="none" fill-rule="evenodd" stroke-linecap="round" stroke-linejoin="round"></path></svg>',
        
        description: "",
        section: "Posts",
        handler: () => {
          
            window.open("https://medium.com/@al-folio/displaying-external-posts-on-your-al-folio-blog-b60a1d241a0a?source=rss-17feae71c3c4------2", "_blank");
          
        },
      },{id: "news-started-my-personal-website",
          title: 'Started my personal website! 🎉',
          description: "",
          section: "News",},{id: "projects-advanced-programming",
          title: 'Advanced Programming',
          description: "Object-Oriented Programming projects including games and management systems",
          section: "Projects",handler: () => {
              window.location.href = "/projects/advanced_programming/";
            },},{id: "projects-data-structures-amp-algorithms",
          title: 'Data Structures &amp;amp; Algorithms',
          description: "Implementation of fundamental data structures and graph algorithms in C++",
          section: "Projects",handler: () => {
              window.location.href = "/projects/data_structures/";
            },},{id: "projects-handwritten-math-recognition",
          title: 'Handwritten Math Recognition',
          description: "End-to-end pipeline for detecting and recognizing mathematical expressions",
          section: "Projects",handler: () => {
              window.location.href = "/projects/math_recognition/";
            },},{id: "projects-ml-course-homeworks",
          title: 'ML Course Homeworks',
          description: "Assignments and implementations for the Machine Learning course at University of Tehran",
          section: "Projects",handler: () => {
              window.location.href = "/projects/ml-homeworks/";
            },},{id: "projects-nonlinear-programming",
          title: 'Nonlinear Programming',
          description: "Optimization algorithms and implementation of nonlinear methods",
          section: "Projects",handler: () => {
              window.location.href = "/projects/nlp_assignments/";
            },},{id: "projects-resnet-18-on-cifar-10",
          title: 'ResNet-18 on CIFAR-10',
          description: "From-scratch PyTorch implementation achieving 94.51% test accuracy",
          section: "Projects",handler: () => {
              window.location.href = "/projects/resnet18-cifar10/";
            },},{id: "projects-transformer-translation",
          title: 'Transformer Translation',
          description: "&#39;Attention Is All You Need&#39; implemented from scratch in PyTorch",
          section: "Projects",handler: () => {
              window.location.href = "/projects/transformer/";
            },},{id: "projects-u-net-segmentation",
          title: 'U-Net Segmentation',
          description: "PyTorch implementation with Attention Gates achieving 0.8375 IoU",
          section: "Projects",handler: () => {
              window.location.href = "/projects/unet/";
            },},{id: "projects-yolov3-object-detection",
          title: 'YOLOv3 Object Detection',
          description: "PyTorch implementation from scratch without pretrained weights",
          section: "Projects",handler: () => {
              window.location.href = "/projects/yolov3/";
            },},{
        id: 'social-email',
        title: 'email',
        section: 'Socials',
        handler: () => {
          window.open("mailto:%61%68%6D%61%64%72%65%7A%61.%66%61%72%76%61%72%64%69%6E@%67%6D%61%69%6C.%63%6F%6D", "_blank");
        },
      },{
        id: 'social-github',
        title: 'GitHub',
        section: 'Socials',
        handler: () => {
          window.open("https://github.com/ahmadrezafarvardin", "_blank");
        },
      },{
        id: 'social-linkedin',
        title: 'LinkedIn',
        section: 'Socials',
        handler: () => {
          window.open("https://www.linkedin.com/in/ahmadreza-farvardin", "_blank");
        },
      },{
        id: 'social-x',
        title: 'X',
        section: 'Socials',
        handler: () => {
          window.open("https://twitter.com/ahmadrezafv", "_blank");
        },
      },{
        id: 'social-rss',
        title: 'RSS Feed',
        section: 'Socials',
        handler: () => {
          window.open("/feed.xml", "_blank");
        },
      },{
      id: 'light-theme',
      title: 'Change theme to light',
      description: 'Change the theme of the site to Light',
      section: 'Theme',
      handler: () => {
        setThemeSetting("light");
      },
    },
    {
      id: 'dark-theme',
      title: 'Change theme to dark',
      description: 'Change the theme of the site to Dark',
      section: 'Theme',
      handler: () => {
        setThemeSetting("dark");
      },
    },
    {
      id: 'system-theme',
      title: 'Use system default theme',
      description: 'Change the theme of the site to System Default',
      section: 'Theme',
      handler: () => {
        setThemeSetting("system");
      },
    },];
