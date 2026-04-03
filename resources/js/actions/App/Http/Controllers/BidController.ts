import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\BidController::store
 * @see app/Http/Controllers/BidController.php:14
 * @route '/listings/{listing}/bid'
 */
export const store = (args: { listing: number | { id: number } } | [listing: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(args, options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/listings/{listing}/bid',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\BidController::store
 * @see app/Http/Controllers/BidController.php:14
 * @route '/listings/{listing}/bid'
 */
store.url = (args: { listing: number | { id: number } } | [listing: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
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

    return store.definition.url
            .replace('{listing}', parsedArgs.listing.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\BidController::store
 * @see app/Http/Controllers/BidController.php:14
 * @route '/listings/{listing}/bid'
 */
store.post = (args: { listing: number | { id: number } } | [listing: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\BidController::store
 * @see app/Http/Controllers/BidController.php:14
 * @route '/listings/{listing}/bid'
 */
    const storeForm = (args: { listing: number | { id: number } } | [listing: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: store.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\BidController::store
 * @see app/Http/Controllers/BidController.php:14
 * @route '/listings/{listing}/bid'
 */
        storeForm.post = (args: { listing: number | { id: number } } | [listing: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: store.url(args, options),
            method: 'post',
        })
    
    store.form = storeForm
const BidController = { store }

export default BidController