$(document).ready(function () {

    // دالة لفك تشفير QR / Barcode مرة واحدة
    function decodeOnce(codeReader, selectedDeviceId) {
        codeReader.decodeFromInputVideoDevice(selectedDeviceId, 'video').then((result) => {
            console.log(result);
            $('input[name="sh_inventory_adjt_barcode_mobile"]').val(result.text);
            $('input[name="sh_inventory_adjt_barcode_mobile"]').change();

            // إعادة ضبط القارئ
            codeReader.reset();

            // إخفاء الفيديو
            $('#js_id_sh_inventory_adjt_barcode_mobile_vid_div').hide();

            // إخفاء زر الإيقاف
            $("#js_id_sh_inventory_adjt_barcode_mobile_reset_btn").hide();

            // عرض النتيجة
            document.getElementById('js_id_sh_inventory_adjt_barcode_mobile_result').textContent = result.text;

        }).catch((err) => {
            console.error("Error decoding once: ", err);
        });
    }

    // دالة لفك التشفير المستمر
    function decodeContinuously(codeReader, selectedDeviceId) {
        codeReader.decodeFromInputVideoDeviceContinuously(selectedDeviceId, 'video', (result, err) => {
            if (result) {
                console.log('Found QR code!', result);
                $('input[name="sh_inventory_adjt_barcode_mobile"]').val(result.text);
                $('input[name="sh_inventory_adjt_barcode_mobile"]').change();

                // عرض النتيجة
                document.getElementById('js_id_sh_inventory_adjt_barcode_mobile_result').textContent = result.text;
            }

            if (err) {
                // التعامل مع الأخطاء المحتملة
                if (err instanceof ZXing.NotFoundException) {
                    console.log('No QR code found.');
                    $('input[name="sh_inventory_adjt_barcode_mobile"]').val('');
                    $('input[name="sh_inventory_adjt_barcode_mobile"]').change();
                }

                if (err instanceof ZXing.ChecksumException) {
                    console.log('A code was found, but its value was not valid.');
                }

                if (err instanceof ZXing.FormatException) {
                    console.log('A code was found, but it was in an invalid format.');
                }
            }
        });
    }

    // إخفاء زر الإيقاف عند تحميل الصفحة
    $("#js_id_sh_inventory_adjt_barcode_mobile_reset_btn").hide();

    let selectedDeviceId;

    const codeReader = new ZXing.BrowserMultiFormatReader();
    console.log('ZXing code reader initialized');

    // الحصول على الأجهزة المتصلة
    codeReader.getVideoInputDevices().then(function (result) {
        const sourceSelect = document.getElementById('js_id_sh_inventory_adjt_barcode_mobile_cam_select');

        $('input[name="sh_inventory_adjt_barcode_mobile"]').val('');
        $('input[name="sh_inventory_adjt_barcode_mobile"]').change();

        // إضافة كل كاميرا متصلة
        result.forEach(function (item) {
            const sourceOption = document.createElement('option');
            sourceOption.text = item.label;
            sourceOption.value = item.deviceId;
            sourceSelect.appendChild(sourceOption);
        });

        // عند تغيير الكاميرا المحددة
        $(document).on('change', '#js_id_sh_inventory_adjt_barcode_mobile_cam_select', function () {
            selectedDeviceId = sourceSelect.value;
        });

        // عند الضغط على زر "ابدأ"
        $(document).on("click", "#js_id_sh_inventory_adjt_barcode_mobile_start_btn", function () {
            $('input[name="sh_inventory_adjt_barcode_mobile"]').val('');
            $('input[name="sh_inventory_adjt_barcode_mobile"]').change();

            // عرض الفيديو
            $('#js_id_sh_inventory_adjt_barcode_mobile_vid_div').show();

            // عرض زر الإيقاف
            $("#js_id_sh_inventory_adjt_barcode_mobile_reset_btn").show();

            // تحديد إذا كان المسح مستمرًا أو لمرة واحدة
            if ($('span[name="sh_inventory_adjt_bm_is_cont_scan"]').text() === 'True') {
                decodeContinuously(codeReader, selectedDeviceId);
            } else {
                decodeOnce(codeReader, selectedDeviceId);
            }
        });

        // عند الضغط على زر "إيقاف" أو "إعادة تعيين"
        $(document).on("click", "#js_id_sh_inventory_adjt_barcode_mobile_reset_btn", function () {
            console.log('STOP CAMERA');
            document.getElementById('js_id_sh_inventory_adjt_barcode_mobile_result').textContent = '';

            // إعادة تعيين المدخلات
            $('input[name="sh_inventory_adjt_barcode_mobile"]').val('');
            $('input[name="sh_inventory_adjt_barcode_mobile"]').change();

            // إعادة ضبط القارئ
            codeReader.reset();

            // إخفاء الفيديو
            $('#js_id_sh_inventory_adjt_barcode_mobile_vid_div').hide();

            // إخفاء زر الإيقاف
            $("#js_id_sh_inventory_adjt_barcode_mobile_reset_btn").hide();
        });

    }).catch(function (reason) {
        console.log("Error ==>" + reason);
    });

});
