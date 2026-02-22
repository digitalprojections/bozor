import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../wayfinder'
/**
* @see \App\Http\Controllers\DashboardController::wonItems
 * @see app/Http/Controllers/DashboardController.php:55
 * @route '/dashboard/won-items'
 */
export const wonItems = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: wonItems.url(options),
    method: 'get',
})

wonItems.definition = {
    methods: ["get","head"],
    url: '/dashboard/won-items',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\DashboardController::wonItems
 * @see app/Http/Controllers/DashboardController.php:55
 * @route '/dashboard/won-items'
 */
wonItems.url = (options?: RouteQueryOptions) => {
    return wonItems.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\DashboardController::wonItems
 * @see app/Http/Controllers/DashboardController.php:55
 * @route '/dashboard/won-items'
 */
wonItems.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: wonItems.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\DashboardController::wonItems
 * @see app/Http/Controllers/DashboardController.php:55
 * @route '/dashboard/won-items'
 */
wonItems.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: wonItems.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\DashboardController::wonItems
 * @see app/Http/Controllers/DashboardController.php:55
 * @route '/dashboard/won-items'
 */
    const wonItemsForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: wonItems.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\DashboardController::wonItems
 * @see app/Http/Controllers/DashboardController.php:55
 * @route '/dashboard/won-items'
 */
        wonItemsForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: wonItems.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\DashboardController::wonItems
 * @see app/Http/Controllers/DashboardController.php:55
 * @route '/dashboard/won-items'
 */
        wonItemsForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: wonItems.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    wonItems.form = wonItemsForm
/**
* @see \App\Http\Controllers\DashboardController::soldItems
 * @see app/Http/Controllers/DashboardController.php:118
 * @route '/dashboard/sold-items'
 */
export const soldItems = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: soldItems.url(options),
    method: 'get',
})

soldItems.definition = {
    methods: ["get","head"],
    url: '/dashboard/sold-items',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\DashboardController::soldItems
 * @see app/Http/Controllers/DashboardController.php:118
 * @route '/dashboard/sold-items'
 */
soldItems.url = (options?: RouteQueryOptions) => {
    return soldItems.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\DashboardController::soldItems
 * @see app/Http/Controllers/DashboardController.php:118
 * @route '/dashboard/sold-items'
 */
soldItems.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: soldItems.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\DashboardController::soldItems
 * @see app/Http/Controllers/DashboardController.php:118
 * @route '/dashboard/sold-items'
 */
soldItems.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: soldItems.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\DashboardController::soldItems
 * @see app/Http/Controllers/DashboardController.php:118
 * @route '/dashboard/sold-items'
 */
    const soldItemsForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: soldItems.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\DashboardController::soldItems
 * @see app/Http/Controllers/DashboardController.php:118
 * @route '/dashboard/sold-items'
 */
        soldItemsForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: soldItems.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\DashboardController::soldItems
 * @see app/Http/Controllers/DashboardController.php:118
 * @route '/dashboard/sold-items'
 */
        soldItemsForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: soldItems.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    soldItems.form = soldItemsForm
const dashboard = {
    wonItems: Object.assign(wonItems, wonItems),
soldItems: Object.assign(soldItems, soldItems),
}

export default dashboard