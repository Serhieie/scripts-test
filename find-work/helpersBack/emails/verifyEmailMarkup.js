const createVerifyEmailMarkup = (BASE_URL, verificationCode) => {
  const verifyEmailMarkup = `<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Email Verification</title>
     <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link
      href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600&family=Bebas+Neue&family=Electrolize&family=Iceland&display=swap"
      rel="stylesheet"
    />
    <style>
        .body {
                   font-family: Montserrat, sans-serif;
            width: 100%;
            height:100%;
            margin: 0;
            padding: 30px 15px;
              background-color: #1E293B;
                border-radius: 12px;
        }

        .container {
            max-width: 600px;
            margin: 20px auto 40px;
            padding: 20px;
           background-color: #0F172A;
            box-shadow: 4px 4px 10px rgba(0, 0, 0, 0.4);
              border-radius: 10px;
        }

        h1 {
            color: #CBD5E1;
            text-align: center;
            margin-bottom: 20px;
        }

        p {
            color: #F1F5F9;
            font-size:18px;
        }

        .button {
           font-family: Montserrat, sans-serif;
            display: block;
            width: 160px;
            font-size: 18px;
            background-color: #007bff;
            color: white;
            text-decoration: none;
            text-align: center;
            margin: 30px auto 0px;
            padding: 10px 20px;
            border-radius: 5px;
            transition: background-color 0.3s ease;
        }

        .button:hover {
                 color: white;
            background-color: #0056b3;
        }

        .text {
            color: #F1F5F9;
            text-align: center;
            font-size: 22px;
        }
    </style>
</head>

<body>
<div class="body">
   <div class="container">
        <h1>Email Verification</h1>
        <p>Dear User,</p>
        <p>You have received this email because someone (possibly you) registered on our website.</p>
        <p>To complete the registration process, please click the button below to verify your email address:</p>
        <p><a class="button" target="_blank" href="${BASE_URL}/api/auth/verify/${verificationCode}">Verify Email</a></p>
    </div>
     <p class="text" >If you did not register on our website, you can safely ignore this email.</p>
     <p class="text">Thank you!</p></div>
 
</body>

</html>
`;
  return verifyEmailMarkup;
};

module.exports = createVerifyEmailMarkup;
