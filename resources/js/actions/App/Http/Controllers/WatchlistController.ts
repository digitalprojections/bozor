import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\WatchlistController::index
 * @see app/Http/Controllers/WatchlistController.php:15
 * @route '/watchlist'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/watchlist',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\WatchlistController::index
 * @see app/Http/Controllers/WatchlistController.php:15
 * @route '/watchlist'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\WatchlistController::index
 * @see app/Http/Controllers/WatchlistController.php:15
 * @route '/watchlist'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\WatchlistController::index
 * @see app/Http/Controllers/WatchlistController.php:15
 * @route '/watchlist'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\WatchlistController::index
 * @see app/Http/Controllers/WatchlistController.php:15
 * @route '/watchlist'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\WatchlistController::index
 * @see app/Http/Controllers/WatchlistController.php:15
 * @route '/watchlist'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\WatchlistController::index
 * @see app/Http/Controllers/WatchlistController.php:15
 * @route '/watchlist'
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
* @see \App\Http\Controllers\WatchlistController::toggle
 * @see app/Http/Controllers/WatchlistController.php:30
 * @route '/watchlist/{listing}/toggle'
 */
export const toggle = (args: { listing: number | { id: number } } | [listing: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: toggle.url(args, options),
    method: 'post',
})

toggle.definition = {
    methods: ["post"],
    url: '/watchlist/{listing}/toggle',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\WatchlistController::toggle
 * @see app/Http/Controllers/WatchlistController.php:30
 * @route '/watchlist/{listing}/toggle'
 */
toggle.url = (args: { listing: number | { id: number } } | [listing: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { listing: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { listing: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    listing: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        listing: typeof args.listing === 'object'
                ? args.listing.id
                : args.listing,
                }

    return toggle.definition.url
            .replace('{listing}', parsedArgs.listing.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\WatchlistController::toggle
 * @see app/Http/Controllers/WatchlistController.php:30
 * @route '/watchlist/{listing}/toggle'
 */
toggle.post = (args: { listing: number | { id: number } } | [listing: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: toggle.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\WatchlistController::toggle
 * @see app/Http/Controllers/WatchlistController.php:30
 * @route '/watchlist/{listing}/toggle'
 */
    const toggleForm = (args: { listing: number | { id: number } } | [listing: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: toggle.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\WatchlistController::toggle
 * @see app/Http/Controllers/WatchlistController.php:30
 * @route '/watchlist/{listing}/toggle'
 */
        toggleForm.post = (args: { listing: number | { id: number } } | [listing: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: toggle.url(args, options),
            method: 'post',
        })
    
    toggle.form = toggleForm
const WatchlistController = { index, toggle }

export default WatchlistController