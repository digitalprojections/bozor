import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../wayfinder'
import profiles from './profiles'
import campaigns from './campaigns'
/**
* @see \App\Http\Controllers\Admin\AdvertisingController::index
 * @see app/Http/Controllers/Admin/AdvertisingController.php:15
 * @route '/admin/advertising'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/admin/advertising',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\AdvertisingController::index
 * @see app/Http/Controllers/Admin/AdvertisingController.php:15
 * @route '/admin/advertising'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\AdvertisingController::index
 * @see app/Http/Controllers/Admin/AdvertisingController.php:15
 * @route '/admin/advertising'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Admin\AdvertisingController::index
 * @see app/Http/Controllers/Admin/AdvertisingController.php:15
 * @route '/admin/advertising'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Admin\AdvertisingController::index
 * @see app/Http/Controllers/Admin/AdvertisingController.php:15
 * @route '/admin/advertising'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Admin\AdvertisingController::index
 * @see app/Http/Controllers/Admin/AdvertisingController.php:15
 * @route '/admin/advertising'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Admin\AdvertisingController::index
 * @see app/Http/Controllers/Admin/AdvertisingController.php:15
 * @route '/admin/advertising'
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
const advertising = {
    index: Object.assign(index, index),
profiles: Object.assign(profiles, profiles),
campaigns: Object.assign(campaigns, campaigns),
}

export default advertising