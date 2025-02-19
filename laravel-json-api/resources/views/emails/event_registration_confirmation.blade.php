<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Event Registration Confirmation</title>
</head>
<body>
    <h1>Thank You for Registering!</h1>
    <p>You have successfully registered for the event: <strong>{{ $event->name }}</strong></p>
    <p>Date: {{ \Carbon\Carbon::parse($event->date_time)->format('Y-m-d') }}</p>
    <p>Time: {{ \Carbon\Carbon::parse($event->date_time)->format('H:i') }}</p>    
    <p>Location: {{ $event->location }}</p>
    <p>We look forward to seeing you there!</p>
</body>
</html>
