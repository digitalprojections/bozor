import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../wayfinder'
/**
* @see \App\Http\Controllers\BidController::destroy
 * @see app/Http/Controllers/BidController.php:116
 * @route '/bids/{bid}'
 */
export const destroy = (args: { bid: string | number | { id: string | number } } | [bid: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/bids/{bid}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\BidController::destroy
 * @see app/Http/Controllers/BidController.php:116
 * @route '/bids/{bid}'
 */
destroy.url = (args: { bid: string | number | { id: string | number } } | [bid: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { bid: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { bid: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    bid: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        bid: typeof args.bid === 'object'
                ? args.bid.id
                : args.bid,
                }

    return destroy.definition.url
            .replace('{bid}', parsedArgs.bid.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\BidController::destroy
 * @see app/Http/Controllers/BidController.php:116
 * @route '/bids/{bid}'
 */
destroy.delete = (args: { bid: string | number | { id: string | number } } | [bid: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

    /**
* @see \App\Http\Controllers\BidController::destroy
 * @see app/Http/Controllers/BidController.php:116
 * @route '/bids/{bid}'
 */
    const destroyForm = (args: { bid: string | number | { id: string | number } } | [bid: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: destroy.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'DELETE',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\BidController::destroy
 * @see app/Http/Controllers/BidController.php:116
 * @route '/bids/{bid}'
 */
        destroyForm.delete = (args: { bid: string | number | { id: string | number } } | [bid: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: destroy.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'DELETE',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    destroy.form = destroyForm
const bids = {
    destroy: Object.assign(destroy, destroy),
}

export default bids