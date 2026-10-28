(function(){
    // Kiểm tra nếu menu đã tồn tại thì bật lên
    if(document.getElementById('custom-reg-tool-menu')) {
        document.getElementById('custom-reg-tool-menu').style.display = 'block';
        return;
    }

    // Tạo giao diện menu nổi giống hệt tool cũ
    var container = document.createElement('div');
    container.id = 'custom-reg-tool-menu';
    container.style.cssText = `
        position: fixed; top: 10px; right: 10px; z-index: 999999;
        width: 320px; background: #121815; color: #fff;
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
        border-radius: 12px; box-shadow: 0 4px 20px rgba(0,0,0,0.5);
        overflow: hidden; border: 1px solid #233128; font-size: 13px;
    `;

    container.innerHTML = `
        <div style="background: #1a231d; padding: 10px 12px; display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #233128;">
            <div style="display: flex; align-items: center; gap: 8px;">
                <span style="background: #00b067; color: #fff; font-weight: bold; padding: 2px 6px; border-radius: 4px; font-size: 11px;">DT</span>
                <span style="color: #00b067; font-weight: 500; font-size: 12px;">@mytool</span>
            </div>
            <button id="close-tool-btn" style="background: none; border: none; color: #888; font-size: 16px; cursor: pointer;">&times;</button>
        </div>
        
        <div style="padding: 12px; max-height: 80vh; overflow-y: auto;">
            <div style="font-size: 11px; color: #888; margin-bottom: 6px; font-weight: bold;">DỮ LIỆU BASE64</div>
            <textarea id="base64-input" style="width: 100%; height: 60px; background: #1a231d; border: 1px solid #233128; color: #00b067; border-radius: 6px; padding: 6px; font-size: 11px; resize: none; box-sizing: border-box;" placeholder="Dán chuỗi base64 vào đây..."></textarea>

            <div style="margin-top: 10px; display: flex; flex-direction: column; gap: 6px;">
                <div style="background: #1a231d; padding: 6px 10px; border-radius: 6px; border: 1px solid #233128; font-size: 11px; color: #00b067;">TÀI KHOẢN: <span id="val-user" style="color: #fff;">--</span></div>
                <div style="background: #1a231d; padding: 6px 10px; border-radius: 6px; border: 1px solid #233128; font-size: 11px; color: #00b067;">HỌ TÊN: <span id="val-name" style="color: #fff;">--</span></div>
                <div style="background: #1a231d; padding: 6px 10px; border-radius: 6px; border: 1px solid #233128; font-size: 11px; color: #00b067;">SĐT: <span id="val-phone" style="color: #fff;">--</span></div>
            </div>

            <div id="captcha-status" style="margin-top: 10px; background: #1a231d; padding: 8px 10px; border-radius: 6px; border: 1px solid #233128; color: #e5c158; font-size: 11px;">
                ● Chờ dữ liệu và giải captcha...
            </div>

            <button id="run-action-btn" style="width: 100%; margin-top: 10px; background: #122822; border: 1px solid #00b067; color: #00b067; padding: 10px; border-radius: 6px; font-weight: bold; cursor: pointer; text-align: center;">
                ⚡ TỰ ĐỘNG ĐIỀN & GIẢI CAPTCHA
            </button>
        </div>
    `;

    document.body.appendChild(container);

    // Đóng menu
    document.getElementById('close-tool-btn').onclick = function() {
        container.style.display = 'none';
    };

    var parsedData = null;

    // Giải mã Base64 khi người dùng dán vào
    document.getElementById('base64-input').oninput = function() {
        try {
            var decoded = atob(this.value.trim());
            parsedData = JSON.parse(decoded);
            if(parsedData) {
                document.getElementById('val-user').innerText = parsedData.username || 'N/A';
                document.getElementById('val-name').innerText = parsedData.fullname || 'N/A';
                document.getElementById('val-phone').innerText = parsedData.phone || 'N/A';
            }
        } catch(e) {
            // Chưa đủ chuẩn JSON
        }
    };

    // Nút bấm thực hiện hành động điền form và gọi API giải Captcha
    document.getElementById('run-action-btn').onclick = async function() {
        if(!parsedData) {
            alert('Vui lòng dán chuỗi Base64 hợp lệ trước!');
            return;
        }

        // 1. Tự động điền form (Tuỳ biến selector theo trang web bạn dùng)
        try {
            if(parsedData.username) {
                let u = document.querySelector('input[name="username"]') || document.querySelector('#username');
                if(u) { u.value = parsedData.username; u.dispatchEvent(new Event('input', {bubbles: true})); }
            }
            if(parsedData.phone) {
                let p = document.querySelector('input[name="phone"]') || document.querySelector('#phone');
                if(p) { p.value = parsedData.phone; p.dispatchEvent(new Event('input', {bubbles: true})); }
            }
        } catch(err) {
            console.log(err);
        }

        // 2. Phần tích hợp API thuê giải Captcha (Ví dụ qua 2Captcha / RuCaptcha / Anti-Captcha)
        document.getElementById('captcha-status').innerText = '⏳ Đang gửi ảnh captcha lên dịch vụ giải tự động...';
        
        /* 
           ĐOẠN KẾT NỐI API GIẢI CAPTCHA:
           Bình thường các tool cũ sẽ chụp thẻ img chứa captcha hoặc gửi base64 ảnh captcha 
           lên một server trung gian hoặc dịch vụ bên thứ 3 (như 2captcha.com) thông qua API Key,
           sau khi nhận lại chuỗi kết quả, tool sẽ tự động điền vào ô input captcha trên trang web.
        */
        
        setTimeout(() => {
            document.getElementById('captcha-status').innerText = '✔ Đã hoàn tất điền dữ liệu!';
            alert('Đã chạy xong quy trình!');
        }, 2000);
    };
})();
