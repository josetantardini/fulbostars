$('#contrasena').keyup(function(e) {
    var strongRegex = new RegExp("^(?=.{8,})(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*\\W).*$", "g");
    var mediumRegex = new RegExp("^(?=.{7,})(((?=.*[A-Z])(?=.*[a-z]))|((?=.*[A-Z])(?=.*[0-9]))|((?=.*[a-z])(?=.*[0-9]))).*$", "g");
    var enoughRegex = new RegExp("(?=.{8,}).*", "g");
    if (false == enoughRegex.test($(this).val())) {
        $('#passstrength').removeClass('alert alert-success');
        $('#passstrength').removeClass('alert alert-warning');
        $('#passstrength').addClass('alert alert-danger');
        $('#passstrength').html('Please add more characters.');

    } else if (strongRegex.test($(this).val())) {
        $('#passstrength').removeClass('alert alert-warning');
        $('#passstrength').removeClass('alert alert-danger');
        $('#passstrength').addClass('alert alert-success');
        $('#passstrength').html('Password level: Strong');
    } else if (mediumRegex.test($(this).val())) {
        $('#passstrength').removeClass('alert alert-success');
        $('#passstrength').removeClass('alert alert-danger');
        $('#passstrength').addClass('alert alert-warning');
        $('#passstrength').html('Password level: Medium');
    } else {
        $('#passstrength').removeClass('alert alert-success');
        $('#passstrength').removeClass('alert alert-warning');
        $('#passstrength').addClass('alert alert-danger');
        $('#passstrength').html('Password level: Weak, please use a more complex password');
    }

    return true;
});

$('#rcontrasena').keyup(function(e) {
    let valor = $('#contrasena').keyup().val();

    if (valor != $(this).val()) {
        $('#passstrength2').removeClass('alert alert-success');
        $('#passstrength2').addClass('alert alert-danger');
        $('#passstrength2').html('Passwords are different');
    } else {
        $('#passstrength2').removeClass('alert alert-danger');
        $('#passstrength2').addClass('alert alert-success');
        $('#passstrength2').html('Passwords match');
    }



});