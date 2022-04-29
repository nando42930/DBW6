var messenger = function (messengerRoute, textboxSelector, resultSelector) {

    //a call to messenger will return an object containing its configuration object(config) and the message function
    return {

        config: {
            messengerRoute: messengerRoute,
            textboxSelector: textboxSelector,
            resultSelector: resultSelector
        },

        //add a message
        //beware that function message is not aware of the containing object so we need to pass messenger itself as an argument to this function
        message: function (messenger) {

            var message = $(messenger.config.textboxSelector).val();

            $.ajax({
                url: messenger.config.messengerRoute,
                type: "POST",
                data: JSON.stringify({
                    message: message
                }),
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                beforeSend: function () {
                    $(messenger.config.resultSelector).append('<li>' + message + '</li>');
                },
                success: function (data) {
                    $(messenger.config.resultSelector + '>li').last().append(' - <b>checked</b>');
                }
            });
        }
    }
}