import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\TransactionController::consolidate
 * @see app/Http/Controllers/TransactionController.php:233
 * @route '/transactions/packages/consolidate'
 */
export const consolidate = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: consolidate.url(options),
    method: 'post',
})

consolidate.definition = {
    methods: ["post"],
    url: '/transactions/packages/consolidate',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\TransactionController::consolidate
 * @see app/Http/Controllers/TransactionController.php:233
 * @route '/transactions/packages/consolidate'
 */
consolidate.url = (options?: RouteQueryOptions) => {
    return consolidate.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\TransactionController::consolidate
 * @see app/Http/Controllers/TransactionController.php:233
 * @route '/transactions/packages/consolidate'
 */
consolidate.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: consolidate.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\TransactionController::consolidate
 * @see app/Http/Controllers/TransactionController.php:233
 * @route '/transactions/packages/consolidate'
 */
    const consolidateForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: consolidate.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\TransactionController::consolidate
 * @see app/Http/Controllers/TransactionController.php:233
 * @route '/transactions/packages/consolidate'
 */
        consolidateForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: consolidate.url(options),
            method: 'post',
        })
    
    consolidate.form = consolidateForm
const packages = {
    consolidate: Object.assign(consolidate, consolidate),
}

export default packages