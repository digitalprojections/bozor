import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\MarketplaceController::index
 * @see app/Http/Controllers/MarketplaceController.php:19
 * @route '/marketplace'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/marketplace',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\MarketplaceController::index
 * @see app/Http/Controllers/MarketplaceController.php:19
 * @route '/marketplace'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\MarketplaceController::index
 * @see app/Http/Controllers/MarketplaceController.php:19
 * @route '/marketplace'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\MarketplaceController::index
 * @see app/Http/Controllers/MarketplaceController.php:19
 * @route '/marketplace'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\MarketplaceController::index
 * @see app/Http/Controllers/MarketplaceController.php:19
 * @route '/marketplace'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\MarketplaceController::index
 * @see app/Http/Controllers/MarketplaceController.php:19
 * @route '/marketplace'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\MarketplaceController::index
 * @see app/Http/Controllers/MarketplaceController.php:19
 * @route '/marketplace'
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
* @see \App\Http\Controllers\MarketplaceController::messages
 * @see app/Http/Controllers/MarketplaceController.php:123
 * @route '/messages'
 */
export const messages = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: messages.url(options),
    method: 'get',
})

messages.definition = {
    methods: ["get","head"],
    url: '/messages',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\MarketplaceController::messages
 * @see app/Http/Controllers/MarketplaceController.php:123
 * @route '/messages'
 */
messages.url = (options?: RouteQueryOptions) => {
    return messages.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\MarketplaceController::messages
 * @see app/Http/Controllers/MarketplaceController.php:123
 * @route '/messages'
 */
messages.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: messages.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\MarketplaceController::messages
 * @see app/Http/Controllers/MarketplaceController.php:123
 * @route '/messages'
 */
messages.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: messages.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\MarketplaceController::messages
 * @see app/Http/Controllers/MarketplaceController.php:123
 * @route '/messages'
 */
    const messagesForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: messages.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\MarketplaceController::messages
 * @see app/Http/Controllers/MarketplaceController.php:123
 * @route '/messages'
 */
        messagesForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: messages.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\MarketplaceController::messages
 * @see app/Http/Controllers/MarketplaceController.php:123
 * @route '/messages'
 */
        messagesForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: messages.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    messages.form = messagesForm
const MarketplaceController = { index, messages }

export default MarketplaceController