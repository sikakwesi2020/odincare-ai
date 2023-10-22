$(function () {

    let currentOutput, isDbSet = false;
    const textToSpeak = $('#OdinResponse');
    const speakButton = $('#ResponseToSpeech');
    const stopButton = $('#stopButton');
    const synth = window.speechSynthesis;
    let utterance = null;
    // Importing the API and instantiating the client using your keys
    $('#drawer-bottom-example2').hide()
    setTimeout(() => {
        // $('#ExtensionDrawer').trigger('click');
    }, 180);
    // SETUP UP LOCAL DATABASE
    // Save data to local storage
    if (localStorage.getItem('dailySpeeches') == null) {
        localStorage.setItem('dailySpeeches', '');
    }
    isDbSet = true;
    updateRecords(); // update with previos records


    $('#opendrawer').on('click', function () {
        $('#drawer-bottom-example2').show()
    });
    // START LISTENING
    // $('#StartListening').trigger('click');
    // Sub Tabs
    $('.TabButtons').on('click', function () {
        $('.tabElement').addClass('hidden');
        $('.TabButtons').removeClass('text-white').removeClass('bg-gray-900');
        const activeTab = $(this).data('key');
        const title = $(this).data('title');

        $('.' + activeTab + '').removeClass('hidden');
        $(this).addClass('text-white bg-gray-900');
        $('.titleContainer').text(title);
    });

    // Init Chat Gpt
    $('#StarReport').on('click', function (e) {
        e.preventDefault();
        $('#OdinResponse').text('Generating report, please wait...');
        const query = generatAllUserQuery();
        // console.log(query);
        $.ajax({
            url: 'gpt.php', // Replace with your API endpoint
            method: 'POST',
            // contentType: 'application/json',
            data: {
                question: query,
            },
            success: function (data) {
 
                $('#OdinResponse').text(data);
                //$('#ResponseToSpeech').trigger('click');
            },
            error: function (xhr, status, error) {
                // Handle any errors
                console.error('Error:', status, error);
            }
        });

    });






    // start recognition
    // Check for browser support

    // Check for browser support
    if ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window) {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        const recognition = new SpeechRecognition();
        const output = $('#spechOutput');
        const startButton = $('#StartListening');
        const ResartButton = $('#RestartSpeech');
        const saveRecord = $('#SaveDailyRecord');
        const stopButtons = $('#stopSpeech');


        recognition.start();

        recognition.onstart = () => {
            output.text('Listening...');
        };


        recognition.onresult = (event) => {
            const transcript = event.results[0][0].transcript;
            output.text(transcript); // Update the text in real-time
            currentOutput = transcript;

            $('#OdinVoice').text('Speech processing...');

            setTimeout(() => {
                $('#OdinVoice').text('Got it. save or restart');
            }, 2000);


        };

        recognition.onerror = (event) => {
            $('#OdinVoice').text('I didnt get that, say it again.');
            setTimeout(() => {
                $('#OdinVoice').text('Odin is listening...');
                recognition.start();
            }, 3000);
        };

        recognition.onend = () => {

            setTimeout(() => {
                $('#OdinVoice').text('OdinCare Ai'); // This  handle when speech is not active.
            }, 5000);
        };

        startButton.on('click', function () {
            recognition.start();
        });

        ResartButton.on('click', function () {
            $('#OdinVoice').text('Odin is listening...');
            recognition.start();
        });

        stopButtons.on('click', () => {
            recognition.stop();
        });

        saveRecord.on('click', function () {
            const SpeechText = currentOutput;

            if (SpeechText != "") {
                $('#OdinVoice').text('Saving...');

                // Retrieve data from local storage
                var records = localStorage.getItem('dailySpeeches');
                // append new record with ";" delimeter and save
                localStorage.setItem('dailySpeeches', records + ";" + SpeechText);
                output.text('Listening...');
                currentOutput = "";
                updateRecords();

            } else {
                $('#OdinVoice').text('I didnt get that, say it again.');
                setTimeout(() => {
                    $('#OdinVoice').text('Odin is listening...');
                }, 1000);
                recognition.start();
            }
        });
    } else {
        $('#output').text('Speech Recognition is not supported in your browser.');
    }

    // text to speech recognition


    // Check if the browser supports speech synthesis
    if ('speechSynthesis' in window) {
      
        speakButton.on('click', function () {
            const text = textToSpeak.text();
          if (text) {
             
                    // speechSynthesis.getVoices().filter(function(voice) { return voice.name == selectedVoice; })[0];
	
                    const utterance = new SpeechSynthesisUtterance(text);
                    synth.speak(utterance);
                   
                    $('#stopButton').removeClass('hidden');

                
            }
        });

        stopButton.on('click', function () {
            if (utterance) {
                synth.cancel();
                utterance = null;
                ('#stopButton').addClass('hidden');
            }
        });
    } else {
        console.log('Speech synthesis is not supported in your browser.');
    }






    // update New data
    function updateRecords() {
        var currentData = localStorage.getItem('dailySpeeches');
        // Split the string into an array using the delimiter ":"
        var dataArray = currentData.split(";");
        let reportHtml = "";
        // Using a for loop
        for (var i = 0; i < dataArray.length; i++) {
            if (dataArray[i] != '') {
                let Eachcontent = `<li class="flex items-center">
                                <svg class="w-3.5 h-3.5 mr-2 text-green-500 dark:text-green-400 flex-shrink-0" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 8.207-4 4a1 1 0 0 1-1.414 0l-2-2a1 1 0 0 1 1.414-1.414L9 10.586l3.293-3.293a1 1 0 0 1 1.414 1.414Z"/>
                                    </svg>
                                ${dataArray[i]}
                            </li>`;
                reportHtml += Eachcontent
            }

        }

        $('#reportContent').html(reportHtml);

    }

    function generatAllUserQuery() {
        var currentData = localStorage.getItem('dailySpeeches');
        // Split the string into an array using the delimiter ":"
        var dataArray = currentData.split(";");
        let StringQuery = "Hello, i am providing you all my health related issues, analyse it and provide me with an educational analysis, summarize to the main points only.";
        for (var i = 0; i < dataArray.length; i++) {

            StringQuery += dataArray[i] + ",";

        }

        return StringQuery;
    }
});

