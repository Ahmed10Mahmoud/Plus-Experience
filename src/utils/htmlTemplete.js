export const tempHtml = (activationCode) => {
    return `<!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Activate Account</title>
    </head>
    <body>
        <p>Hello,</p>
        <p>Please click the following link to activate your account:</p>
        <a href="http://localhost:3500/auth/confirmEmail/${activationCode}">Activate Account</a>
        <p>If you didn't request this, you can safely ignore this email.</p>
        <p>Thank you,</p>
        <p>Your Company Name</p>
    </body>
    </html>`;
}

export const forgetCodetHtml = (forgetCode) => {
    return `<!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Forget Password Code</title>
    </head>
    <body>
        <p>Hello,</p>
        <p>You have requested to reset your password. Please use the following code to reset your password:</p>
        <h2 style="font-size: 24px; font-weight: bold;">${forgetCode}</h2>
        <p>If you didn't request this, you can safely ignore this email.</p>
        <p>Thank you,</p>
        <p>Your Company Name</p>
    </body>
    </html>`;
}



