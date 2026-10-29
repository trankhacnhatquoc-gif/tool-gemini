(function(){
    if(document.getElementById('custom-reg-tool-menu')) {
        document.getElementById('custom-reg-tool-menu').style.display = 'block';
        return;
    }

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
                <span style="color: #00b067; font-weight: 500; font-size: 12px;">@autotool</span>
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
                ● Sẵn sàng tự động điền & giải captcha...
            </div>

            <button id="run-action-btn" style="width: 100%; margin-top: 10px; background: #122822; border: 1px solid #00b067; color: #00b067; padding: 10px; border-radius: 6px; font-weight: bold; cursor: pointer; text-align: center;">
                ⚡ TỰ ĐỘNG ĐIỀN & GIẢI CAPTCHA
            </button>
        </div>
    `;

    document.body.appendChild(container);

    document.getElementById('close-tool-btn').onclick = function() {
        container.style.display = 'none';
    };

    var parsedData = null;

    document.getElementById('base64-input').oninput = function() {
        try {
            var decoded = atob(this.value.trim());
            parsedData = JSON.parse(decoded);
            if(parsedData) {
                document.getElementById('val-user').innerText = parsedData.username || parsedData.user || 'N/A';
                document.getElementById('val-name').innerText = parsedData.fullname || parsedData.name || 'N/A';
                document.getElementById('val-phone').innerText = parsedData.phone || 'N/A';
            }
        } catch(e) {}
    };

    document.getElementById('run-action-btn').onclick = async function() {
        if(!parsedData) {
            alert('Vui lòng dán chuỗi Base64 hợp lệ trước!');
            return;
        }

        const statusDiv = document.getElementById('captcha-status');

        try {
            if(parsedData.username) {
                let u = document.querySelector('input[name="username"]') || document.querySelector('#username');
                if(u) { u.value = parsedData.username; u.dispatchEvent(new Event('input', {bubbles: true})); }
            }
            if(parsedData.phone) {
                let p = document.querySelector('input[name="phone"]') || document.querySelector('#phone');
                if(p) { p.value = parsedData.phone; p.dispatchEvent(new Event('input', {bubbles: true})); }
            }
            if(parsedData.fullname) {
                let n = document.querySelector('input[name="fullname"]') || document.querySelector('#fullname');
                if(n) { n.value = parsedData.fullname; n.dispatchEvent(new Event('input', {bubbles: true})); }
            }
            statusDiv.innerText = '✔ Đã điền thông tin tài khoản xong.';
        } catch(err) {
            console.log(err);
        }

        try {
            statusDiv.innerText = '⏳ Đang tìm ảnh captcha trên trang...';
            let captchaImg = document.querySelector('img[src*="captcha"]') || document.querySelector('.code-img img') || document.querySelector('img[alt*="captcha"]');
            
            if(!captchaImg) {
                alert('Không tìm thấy hình ảnh captcha tự động trên trang này!');
                return;
            }

            statusDiv.innerText = '⏳ Đang tải ảnh captcha và gửi lên hệ thống...';

            let canvas = document.createElement('canvas');
            canvas.width = captchaImg.naturalWidth || captchaImg.width;
            canvas.height = captchaImg.naturalHeight || captchaImg.height;
            let ctx = canvas.getContext('2d');
            ctx.drawImage(captchaImg, 0, 0);
            let imgBase64 = canvas.toDataURL('image/png').replace(/^data:image\/(png|jpg);base64,/, '');

            let apiKey = '7080b9ccfc5ab824132d92c2b16933e7';
            let formData = new FormData();
            formData.append('api_key', apiKey);
            formData.append('image', imgBase64);

            statusDiv.innerText = '⏳ Đang chờ giải mã captcha...';

            let response = await fetch('https://autocapcha.pro/api/createTask', {
                method: 'POST',
                body: formData
            });
            let result = await response.json();

            if(result && (result.code === 200 || result.success || result.text)) {
                let captchaCode = result.text || result.data;
                let captchaInput = document.querySelector('input[name*="captcha"]') || document.querySelector('input[name="code"]');
                if(captchaInput) {
                    captchaInput.value = captchaCode;
                    captchaInput.dispatchEvent(new Event('input', {bubbles: true}));
                    statusDiv.innerText = '✔ Giải captcha thành công: ' + captchaCode;
                    alert('Hoàn tất tự động điền và giải mã captcha!');
                } else {
                    alert('Đã giải được mã: ' + captchaCode + ' nhưng không tìm thấy ô nhập captcha!');
                }
            } else {
                statusDiv.innerText = '❌ Lỗi giải captcha từ hệ thống!';
                alert('Phản hồi từ API: ' + (result.message || 'Không thành công'));
            }
        } catch(e) {
            console.error(e);
            statusDiv.innerText = '❌ Lỗi kết nối API giải captcha!';
            alert('Có lỗi xảy ra trong quá trình gọi API!');
        }
    };
})();

