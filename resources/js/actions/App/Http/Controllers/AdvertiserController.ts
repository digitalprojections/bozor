import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\AdvertiserController::index
 * @see app/Http/Controllers/AdvertiserController.php:10
 * @route '/advertising'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/advertising',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\AdvertiserController::index
 * @see app/Http/Controllers/AdvertiserController.php:10
 * @route '/advertising'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\AdvertiserController::index
 * @see app/Http/Controllers/AdvertiserController.php:10
 * @route '/advertising'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\AdvertiserController::index
 * @see app/Http/Controllers/AdvertiserController.php:10
 * @route '/advertising'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\AdvertiserController::index
 * @see app/Http/Controllers/AdvertiserController.php:10
 * @route '/advertising'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\AdvertiserController::index
 * @see app/Http/Controllers/AdvertiserController.php:10
 * @route '/advertising'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\AdvertiserController::index
 * @see app/Http/Controllers/AdvertiserController.php:10
 * @route '/advertising'
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
* @see \App\Http\Controllers\AdvertiserController::apply
 * @see app/Http/Controllers/AdvertiserController.php:23
 * @route '/advertising/apply'
 */
export const apply = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: apply.url(options),
    method: 'post',
})

apply.definition = {
    methods: ["post"],
    url: '/advertising/apply',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\AdvertiserController::apply
 * @see app/Http/Controllers/AdvertiserController.php:23
 * @route '/advertising/apply'
 */
apply.url = (options?: RouteQueryOptions) => {
    return apply.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\AdvertiserController::apply
 * @see app/Http/Controllers/AdvertiserController.php:23
 * @route '/advertising/apply'
 */
apply.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: apply.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\AdvertiserController::apply
 * @see app/Http/Controllers/AdvertiserController.php:23
 * @route '/advertising/apply'
 */
    const applyForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: apply.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\AdvertiserController::apply
 * @see app/Http/Controllers/AdvertiserController.php:23
 * @route '/advertising/apply'
 */
        applyForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: apply.url(options),
            method: 'post',
        })
    
    apply.form = applyForm
const AdvertiserController = { index, apply }

export default AdvertiserController