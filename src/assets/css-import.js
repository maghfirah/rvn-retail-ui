let head  = document.getElementsByTagName('head')[0];

let linkMain  = document.createElement('link');
linkMain.rel  = 'stylesheet';
linkMain.type = 'text/css';
linkMain.href = window["env"]["assetsUrl"]+'/doku-ui-framework/css-doku%401.0.0/css/main.min.css';
linkMain.media = 'all';
head.appendChild(linkMain);

let linkJokul  = document.createElement('link');
linkJokul.rel  = 'stylesheet';
linkJokul.type = 'text/css';
linkJokul.href = window["env"]["assetsUrl"]+'/doku-ui-framework/css-jokul/1.0.0/main.css';
linkJokul.media = 'all';
head.appendChild(linkJokul);

let linkIcon  = document.createElement('link');
linkIcon.rel  = 'stylesheet';
linkIcon.type = 'text/css';
linkIcon.href = window["env"]["assetsUrl"]+'/doku-ui-framework/icons-doku/css/icons.css';
linkIcon.media = 'all';
head.appendChild(linkIcon);
