import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\Admin\ListingReportController::index
 * @see app/Http/Controllers/Admin/ListingReportController.php:16
 * @route '/admin/reports'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/admin/reports',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\ListingReportController::index
 * @see app/Http/Controllers/Admin/ListingReportController.php:16
 * @route '/admin/reports'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\ListingReportController::index
 * @see app/Http/Controllers/Admin/ListingReportController.php:16
 * @route '/admin/reports'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Admin\ListingReportController::index
 * @see app/Http/Controllers/Admin/ListingReportController.php:16
 * @route '/admin/reports'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Admin\ListingReportController::index
 * @see app/Http/Controllers/Admin/ListingReportController.php:16
 * @route '/admin/reports'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Admin\ListingReportController::index
 * @see app/Http/Controllers/Admin/ListingReportController.php:16
 * @route '/admin/reports'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Admin\ListingReportController::index
 * @see app/Http/Controllers/Admin/ListingReportController.php:16
 * @route '/admin/reports'
 */
        indexForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    index.form = indexForm
/**
* @see \App\Http\Controllers\Admin\ListingReportController::update
 * @see app/Http/Controllers/Admin/ListingReportController.php:60
 * @route '/admin/reports/{report}'
 */
export const update = (args: { report: string | number | { id: string | number } } | [report: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update.url(args, options),
    method: 'patch',
})

update.definition = {
    methods: ["patch"],
    url: '/admin/reports/{report}',
} satisfies RouteDefinition<["patch"]>

/**
* @see \App\Http\Controllers\Admin\ListingReportController::update
 * @see app/Http/Controllers/Admin/ListingReportController.php:60
 * @route '/admin/reports/{report}'
 */
update.url = (args: { report: string | number | { id: string | number } } | [report: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { report: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { report: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    report: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        report: typeof args.report === 'object'
                ? args.report.id
                : args.report,
                }

    return update.definition.url
            .replace('{report}', parsedArgs.report.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\ListingReportController::update
 * @see app/Http/Controllers/Admin/ListingReportController.php:60
 * @route '/admin/reports/{report}'
 */
update.patch = (args: { report: string | number | { id: string | number } } | [report: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update.url(args, options),
    method: 'patch',
})

    /**
* @see \App\Http\Controllers\Admin\ListingReportController::update
 * @see app/Http/Controllers/Admin/ListingReportController.php:60
 * @route '/admin/reports/{report}'
 */
    const updateForm = (args: { report: string | number | { id: string | number } } | [report: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: update.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PATCH',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Admin\ListingReportController::update
 * @see app/Http/Controllers/Admin/ListingReportController.php:60
 * @route '/admin/reports/{report}'
 */
        updateForm.patch = (args: { report: string | number | { id: string | number } } | [report: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: update.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'PATCH',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    update.form = updateForm
/**
* @see \App\Http\Controllers\Admin\ListingReportController::listingAction
 * @see app/Http/Controllers/Admin/ListingReportController.php:84
 * @route '/admin/reports/{report}/listing-action'
 */
export const listingAction = (args: { report: string | number | { id: string | number } } | [report: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: listingAction.url(args, options),
    method: 'post',
})

listingAction.definition = {
    methods: ["post"],
    url: '/admin/reports/{report}/listing-action',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Admin\ListingReportController::listingAction
 * @see app/Http/Controllers/Admin/ListingReportController.php:84
 * @route '/admin/reports/{report}/listing-action'
 */
listingAction.url = (args: { report: string | number | { id: string | number } } | [report: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { report: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { report: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    report: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        report: typeof args.report === 'object'
                ? args.report.id
                : args.report,
                }

    return listingAction.definition.url
            .replace('{report}', parsedArgs.report.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\ListingReportController::listingAction
 * @see app/Http/Controllers/Admin/ListingReportController.php:84
 * @route '/admin/reports/{report}/listing-action'
 */
listingAction.post = (args: { report: string | number | { id: string | number } } | [report: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: listingAction.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Admin\ListingReportController::listingAction
 * @see app/Http/Controllers/Admin/ListingReportController.php:84
 * @route '/admin/reports/{report}/listing-action'
 */
    const listingActionForm = (args: { report: string | number | { id: string | number } } | [report: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: listingAction.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Admin\ListingReportController::listingAction
 * @see app/Http/Controllers/Admin/ListingReportController.php:84
 * @route '/admin/reports/{report}/listing-action'
 */
        listingActionForm.post = (args: { report: string | number | { id: string | number } } | [report: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: listingAction.url(args, options),
            method: 'post',
        })
    
    listingAction.form = listingActionForm
/**
* @see \App\Http\Controllers\Admin\ListingReportController::userAction
 * @see app/Http/Controllers/Admin/ListingReportController.php:106
 * @route '/admin/reports/{report}/users/{user}/action'
 */
export const userAction = (args: { report: string | number | { id: string | number }, user: string | number | { id: string | number } } | [report: string | number | { id: string | number }, user: string | number | { id: string | number } ], options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: userAction.url(args, options),
    method: 'post',
})

userAction.definition = {
    methods: ["post"],
    url: '/admin/reports/{report}/users/{user}/action',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Admin\ListingReportController::userAction
 * @see app/Http/Controllers/Admin/ListingReportController.php:106
 * @route '/admin/reports/{report}/users/{user}/action'
 */
userAction.url = (args: { report: string | number | { id: string | number }, user: string | number | { id: string | number } } | [report: string | number | { id: string | number }, user: string | number | { id: string | number } ], options?: RouteQueryOptions) => {
    if (Array.isArray(args)) {
        args = {
                    report: args[0],
                    user: args[1],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        report: typeof args.report === 'object'
                ? args.report.id
                : args.report,
                                user: typeof args.user === 'object'
                ? args.user.id
                : args.user,
                }

    return userAction.definition.url
            .replace('{report}', parsedArgs.report.toString())
            .replace('{user}', parsedArgs.user.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\ListingReportController::userAction
 * @see app/Http/Controllers/Admin/ListingReportController.php:106
 * @route '/admin/reports/{report}/users/{user}/action'
 */
userAction.post = (args: { report: string | number | { id: string | number }, user: string | number | { id: string | number } } | [report: string | number | { id: string | number }, user: string | number | { id: string | number } ], options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: userAction.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Admin\ListingReportController::userAction
 * @see app/Http/Controllers/Admin/ListingReportController.php:106
 * @route '/admin/reports/{report}/users/{user}/action'
 */
    const userActionForm = (args: { report: string | number | { id: string | number }, user: string | number | { id: string | number } } | [report: string | number | { id: string | number }, user: string | number | { id: string | number } ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: userAction.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Admin\ListingReportController::userAction
 * @see app/Http/Controllers/Admin/ListingReportController.php:106
 * @route '/admin/reports/{report}/users/{user}/action'
 */
        userActionForm.post = (args: { report: string | number | { id: string | number }, user: string | number | { id: string | number } } | [report: string | number | { id: string | number }, user: string | number | { id: string | number } ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: userAction.url(args, options),
            method: 'post',
        })
    
    userAction.form = userActionForm
const reports = {
    index: Object.assign(index, index),
update: Object.assign(update, update),
listingAction: Object.assign(listingAction, listingAction),
userAction: Object.assign(userAction, userAction),
}

export default reports