# API

## Stack

LifeBuffer is using Laravel 12 as it's backend framework.

## Role

The LifeBuffer API backend serves two functions:

    - Providing OAuth 2 authentication flow for the webapp and the mobile apps
    - Provide the data layer (as a REST API) for the webapp and the mobile apps

## Models

Users can track activities and create notes.

### Activities

An activity stores a title, notes and the date it is valid for. As well as the time tracking.
The structure is in `database/migrations/2025_07_24_150640_create_activities_table.php`

A day handles the notes and the summary for a specific day.
The structure is in `database/migrations/2025_07_24_151053_create_days_table.php`