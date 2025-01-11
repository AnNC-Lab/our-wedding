import { guest } from './guest/guest.js';
import { comment } from './comment/comment.js';

document.addEventListener('DOMContentLoaded', () => {
    window.ancLab = guest.init();
    window.comment = comment;
});

