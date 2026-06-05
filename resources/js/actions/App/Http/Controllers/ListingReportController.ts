import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\ListingReportController::store
 * @see app/Http/Controllers/ListingReportController.php:13
 * @route '/listings/{listing}/reports'
 */
export const store = (args: { listing: string | number | { id: string | number } } | [listing: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(args, options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/listings/{listing}/reports',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\ListingReportController::store
 * @see app/Http/Controllers/ListingReportController.php:13
 * @route '/listings/{listing}/reports'
 */
store.url = (args: { listing: string | number | { id: string | number } } | [listing: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions) => {
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
* @see \App\Http\Controllers\ListingReportController::store
 * @see app/Http/Controllers/ListingReportController.php:13
 * @route '/listings/{listing}/reports'
 */
store.post = (args: { listing: string | number | { id: string | number } } | [listing: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\ListingReportController::store
 * @see app/Http/Controllers/ListingReportController.php:13
 * @route '/listings/{listing}/reports'
 */
    const storeForm = (args: { listing: string | number | { id: string | number } } | [listing: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: store.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\ListingReportController::store
 * @see app/Http/Controllers/ListingReportController.php:13
 * @route '/listings/{listing}/reports'
 */
        storeForm.post = (args: { listing: string | number | { id: string | number } } | [listing: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: store.url(args, options),
            method: 'post',
        })
    
    store.form = storeForm
const ListingReportController = { store }

export default ListingReportController