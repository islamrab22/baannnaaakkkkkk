// نسخة تجريبية فقط - لا اتصال ببيانات حقيقية أو خادم خلفي
// لا يتم تخزين أو إرسال أو طباعة أي بيانات مدخلة من المستخدم

(function () {
  "use strict";

  var DEMO_OTP = "123456";
  var otpOrigin = "home"; // الشاشة التي يعود إليها زر الرجوع في شاشة التحقق

  function showScreen(name) {
    $(".screen").removeClass("active");
    $('.screen[data-screen="' + name + '"]').addClass("active");
    $(".phone-screen").scrollTop(0);
  }

  function setError($field, $errorBox, message) {
    $field.addClass("is-invalid");
    $errorBox.text(message);
  }

  function clearError($field, $errorBox) {
    $field.removeClass("is-invalid");
    $errorBox.text("");
  }

  function isValidEmail(value) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  }

  function isValidMobile(value) {
    return /^0[0-9]{9}$/.test(value);
  }

  function goToOtp(origin) {
    otpOrigin = origin;
    $("#form-otp")[0].reset();
    clearError($("#otp-input"), $("#otp-error"));
    showScreen("otp");
  }

  // ===== عام: أزرار التنقل =====
  $(document).on("click", "[data-goto]", function () {
    showScreen($(this).data("goto"));
  });

  // ===== شاشة الرقم الوطني (تدفق 1 - شاشة 1) =====
  $("#form-nid").on("submit", function (e) {
    e.preventDefault();
    var $input = $("#nid-input");
    var $error = $("#nid-error");
    var value = $input.val().trim();

    if (value.length < 4) {
      setError($input, $error, "الرجاء إدخال رقم حساب أو رقم هوية صحيح");
      return;
    }

    clearError($input, $error);
    showScreen("login");
  });

  // ===== شاشة تسجيل الدخول (تدفق 1 - شاشة 2) =====
  $("#form-login").on("submit", function (e) {
    e.preventDefault();
    var $user = $("#login-username");
    var $userErr = $("#login-username-error");
    var $pass = $("#login-password");
    var $passErr = $("#login-password-error");
    var valid = true;

    if ($user.val().trim().length < 3) {
      setError($user, $userErr, "الرجاء إدخال اسم مستخدم صحيح");
      valid = false;
    } else {
      clearError($user, $userErr);
    }

    if ($pass.val().length < 4) {
      setError($pass, $passErr, "الرجاء إدخال كلمة مرور صحيحة");
      valid = false;
    } else {
      clearError($pass, $passErr);
    }

    if (!valid) return;

    goToOtp("login");
  });

  // ===== التسجيل باستخدام بطاقة الخصم (تدفق 2) =====
  $("#form-register-card").on("submit", function (e) {
    e.preventDefault();
    var valid = true;

    var $username = $("#rc-username");
    var $usernameErr = $("#rc-username-error");
    if ($username.val().trim().length < 5 || $username.val().trim().length > 20) {
      setError($username, $usernameErr, "اسم المستخدم يجب أن يكون بين 5 و20 حرفاً");
      valid = false;
    } else {
      clearError($username, $usernameErr);
    }

    var $cardNumber = $("#rc-card-number");
    var $cardNumberErr = $("#rc-card-number-error");
    if (!/^[0-9]{12,19}$/.test($cardNumber.val().trim())) {
      setError($cardNumber, $cardNumberErr, "الرجاء إدخال رقم بطاقة صحيح");
      valid = false;
    } else {
      clearError($cardNumber, $cardNumberErr);
    }

    var $cardCode = $("#rc-card-code");
    var $cardCodeErr = $("#rc-card-code-error");
    if (!/^[0-9]{3,4}$/.test($cardCode.val().trim())) {
      setError($cardCode, $cardCodeErr, "الرجاء إدخال رمز بطاقة صحيح");
      valid = false;
    } else {
      clearError($cardCode, $cardCodeErr);
    }

    var $expiry = $("#rc-card-expiry");
    var $expiryErr = $("#rc-card-expiry-error");
    if (!/^(0[1-9]|1[0-2])\/[0-9]{2}$/.test($expiry.val().trim())) {
      setError($expiry, $expiryErr, "الرجاء إدخال تاريخ انتهاء بصيغة MM/YY");
      valid = false;
    } else {
      clearError($expiry, $expiryErr);
    }

    var $mobile = $("#rc-mobile");
    var $mobileErr = $("#rc-mobile-error");
    if (!isValidMobile($mobile.val().trim())) {
      setError($mobile, $mobileErr, "الرجاء إدخال رقم موبايل صحيح");
      valid = false;
    } else {
      clearError($mobile, $mobileErr);
    }

    var $email = $("#rc-email");
    var $emailErr = $("#rc-email-error");
    if (!isValidEmail($email.val().trim())) {
      setError($email, $emailErr, "الرجاء إدخال بريد إلكتروني صحيح");
      valid = false;
    } else {
      clearError($email, $emailErr);
    }

    var $terms = $("#rc-terms");
    var $termsErr = $("#rc-terms-error");
    if (!$terms.is(":checked")) {
      $termsErr.text("يجب الموافقة على الشروط والأحكام");
      valid = false;
    } else {
      $termsErr.text("");
    }

    if (!valid) return;

    goToOtp("register-card");
  });

  // ===== التسجيل باستخدام معلومات الحساب (تدفق 3) =====
  $("#form-register-account").on("submit", function (e) {
    e.preventDefault();
    var valid = true;

    var $username = $("#ra-username");
    var $usernameErr = $("#ra-username-error");
    if ($username.val().trim().length < 5 || $username.val().trim().length > 20) {
      setError($username, $usernameErr, "اسم المستخدم يجب أن يكون بين 5 و20 حرفاً");
      valid = false;
    } else {
      clearError($username, $usernameErr);
    }

    var $branch = $("#ra-branch");
    var $branchErr = $("#ra-branch-error");
    if (!$branch.val()) {
      setError($branch, $branchErr, "الرجاء اختيار فرع");
      valid = false;
    } else {
      clearError($branch, $branchErr);
    }

    var $account = $("#ra-account");
    var $accountErr = $("#ra-account-error");
    if (!/^[0-9]{5,7}$/.test($account.val().trim())) {
      setError($account, $accountErr, "رقم الحساب يجب أن يكون بين 5 و7 أرقام");
      valid = false;
    } else {
      clearError($account, $accountErr);
    }

    var $nid = $("#ra-nid");
    var $nidErr = $("#ra-nid-error");
    if (!/^[0-9]{7,10}$/.test($nid.val().trim())) {
      setError($nid, $nidErr, "الرجاء إدخال رقم هوية صحيح");
      valid = false;
    } else {
      clearError($nid, $nidErr);
    }

    var $birthdate = $("#ra-birthdate");
    var $birthdateErr = $("#ra-birthdate-error");
    if (!$birthdate.val()) {
      setError($birthdate, $birthdateErr, "الرجاء إدخال تاريخ الميلاد");
      valid = false;
    } else {
      clearError($birthdate, $birthdateErr);
    }

    var $mobile = $("#ra-mobile");
    var $mobileErr = $("#ra-mobile-error");
    if (!isValidMobile($mobile.val().trim())) {
      setError($mobile, $mobileErr, "الرجاء إدخال رقم موبايل صحيح");
      valid = false;
    } else {
      clearError($mobile, $mobileErr);
    }

    var $email = $("#ra-email");
    var $emailErr = $("#ra-email-error");
    if (!isValidEmail($email.val().trim())) {
      setError($email, $emailErr, "الرجاء إدخال بريد إلكتروني صحيح");
      valid = false;
    } else {
      clearError($email, $emailErr);
    }

    var $terms = $("#ra-terms");
    var $termsErr = $("#ra-terms-error");
    if (!$terms.is(":checked")) {
      $termsErr.text("يجب الموافقة على الشروط والأحكام");
      valid = false;
    } else {
      $termsErr.text("");
    }

    if (!valid) return;

    goToOtp("register-account");
  });

  // ===== شاشة التحقق من الرمز (مشتركة بين التدفقات الثلاثة) =====
  $("#form-otp").on("submit", function (e) {
    e.preventDefault();
    var $otp = $("#otp-input");
    var $error = $("#otp-error");
    var value = $otp.val().trim();

    if (value.length === 0) {
      setError($otp, $error, "الرجاء إدخال رمز التحقق");
      return;
    }

    if (value !== DEMO_OTP) {
      setError($otp, $error, "رمز التحقق غير صحيح");
      return;
    }

    clearError($otp, $error);
    $("#form-otp")[0].reset();
    showScreen("success");
  });

  $("#otp-back").on("click", function () {
    showScreen(otpOrigin);
  });

  $("#otp-resend").on("click", function (e) {
    e.preventDefault();
    var $error = $("#otp-error");
    $error.css("color", "#2e9e5b").text("تم إرسال رمز تحقق جديد (تجريبي)");
    setTimeout(function () {
      $error.css("color", "").text("");
    }, 2500);
  });

  // إعادة ضبط جميع النماذج والعودة للصفحة الرئيسية عند الرجوع إليها
  $(document).on("click", '[data-goto="home"]', function () {
    $("form").each(function () {
      this.reset();
    });
    $(".field-input, .form-check-input").removeClass("is-invalid");
    $(".field-error").text("");
    otpOrigin = "home";
  });
})();
