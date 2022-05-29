# Invoice manager

Author: <b>Janez Sedeljsak</b>

## Short description

The idea of the app is solving the problem of managing group spendings (eg. collage roomates). For this reason
the app provides a simple interface for tracking your spendings and viewing how much each member of the group has spent. You can create your 
own groups and add people to them. Groups also have a shopping list and some insightful charts to make your life a bit easier. 

You can browse the app without making an account - you can view already registered users and groups and some of their public data, but for the full experience you have to create your
own account.

The app is built with 2 technologies - `PHP` with a basic MVC structure (no framework) as the `RESTful API` and `React` (with `Semantic UI` and `zustand`) for the frontend.

## API endpoints

```json
{
    "api_routes": [
        "api\/v1\/login",
        "api\/v1\/register",
        "api\/v1\/users",
        "api\/v1\/profile\/groups",
        "api\/v1\/profile\/edit",
        "api\/v1\/profile\/invoices",
        "api\/v1\/user\/groups",
        "api\/v1\/groups",
        "api\/v1\/group\/add-user",
        "api\/v1\/group\/members",
        "api\/v1\/group\/potential-members",
        "api\/v1\/group\/invoices",
        "api\/v1\/group\/shopping-items",
        "api\/v1\/group\/create",
        "api\/v1\/group",
        "api\/v1\/invoice\/create",
        "api\/v1\/invoice",
        "api\/v1\/shopping-item\/create",
        "api\/v1\/shopping-item",
        "api\/v1\/stores",
        "api\/v1\/analysis\/invoice"
    ],
    "docs_routes": [
        "api\/v1\/docs\/routes-map"
    ],
    "test_routes": [
        "api\/v1\/test\/status\/200",
        "api\/v1\/test\/status\/400",
        "api\/v1\/test\/status\/401",
        "api\/v1\/test\/status\/404",
        "api\/v1\/test\/status\/405",
        "api\/v1\/test\/method-get",
        "api\/v1\/test\/method-post",
        "api\/v1\/test\/method-delete",
        "api\/v1\/test",
        "api\/v1\/test\/id",
        "api\/v1\/test\/other",
        "api\/v1\/test\/select"
    ]
}
```

## Database model

![dbmodel](https://user-images.githubusercontent.com/43420276/170886682-42af5024-af2c-42d2-b607-7184a9f70af7.png)


### Site-map
