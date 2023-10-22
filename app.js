
$.ajax({
    url: 'odin.php', // Replace with your API endpoint
    method: 'POST',
    // contentType: 'application/json',
    data: {
        question: "Hello Adonai, i have headaches always",
        user: 123
    },
    // headers: {
    //   'Authorization': 'Bearer YOUR_ACCESS_TOKEN', // Replace with your token
    //   'Custom-Header': 'header-value'
    // },
    success: function(data) {
      // Handle the successful response
      console.log('Success:', data);
    },
    error: function(xhr, status, error) {
      // Handle any errors
      console.error('Error:', status, error);
    }
  });
  