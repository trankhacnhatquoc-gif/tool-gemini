// ==UserScript==
// @name         AUTO FILL FFSB (IPHONE - FINAL)
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Tool tự động điền + Auto Thu nhỏ + Custom Chat ID
// @author       DinhTrung04
// @match        *://*/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // --- CẤU HÌNH KHÁCH HÀNG ---
    window.__FFSB_CHAT_ID = "7937236111"; 
    window.__START_MINIMIZED = true;

    // --- ĐỔI LINK GỐC SANG GITHUB CỦA BẠN ---
    // Tool sẽ gọi trực tiếp file ffsb.js trên kho GitHub của bạn thay vì link đã chết
    const SCRIPT_UI_URL = "https://raw.githubusercontent.com/trankhacnhatquoc-gif/tool-gemini-2/main/ffsb.js?v=" + Date.now();

    // --- LOGIC NẠP TOOL ---
    function initTool() {
        if (document.getElementById('_ffsb')) return;
        
        console.log("🚀 iPhone đang nạp Tool từ GitHub của bạn...");
        var s = document.createElement('script');
        s.src = SCRIPT_UI_URL;
        document.head.appendChild(s);
    }

    // Chờ web load xong thì hiện tool
    window.addEventListener('load', function() {
        setTimeout(initTool, 1000);
    });
    
    // Fallback dự phòng
    setTimeout(initTool, 2000);

})();
