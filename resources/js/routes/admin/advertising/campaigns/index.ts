import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\Admin\AdvertisingController::update
 * @see app/Http/Controllers/Admin/AdvertisingController.php:75
 * @route '/admin/advertising/campaigns/{campaign}'
 */
export const update = (args: { campaign: string | number | { id: string | number } } | [campaign: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update.url(args, options),
    method: 'patch',
})

update.definition = {
    methods: ["patch"],
    url: '/admin/advertising/campaigns/{campaign}',
} satisfies RouteDefinition<["patch"]>

/**
* @see \App\Http\Controllers\Admin\AdvertisingController::update
 * @see app/Http/Controllers/Admin/AdvertisingController.php:75
 * @route '/admin/advertising/campaigns/{campaign}'
 */
update.url = (args: { campaign: string | number | { id: string | number } } | [campaign: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { campaign: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { campaign: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    campaign: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        campaign: typeof args.campaign === 'object'
                ? args.campaign.id
                : args.campaign,
                }

    return update.definition.url
            .replace('{campaign}', parsedArgs.campaign.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\AdvertisingController::update
 * @see app/Http/Controllers/Admin/AdvertisingController.php:75
 * @route '/admin/advertising/campaigns/{campaign}'
 */
update.patch = (args: { campaign: string | number | { id: string | number } } | [campaign: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update.url(args, options),
    method: 'patch',
})

    /**
* @see \App\Http\Controllers\Admin\AdvertisingController::update
 * @see app/Http/Controllers/Admin/AdvertisingController.php:75
 * @route '/admin/advertising/campaigns/{campaign}'
 */
    const updateForm = (args: { campaign: string | number | { id: string | number } } | [campaign: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: update.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PATCH',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Admin\AdvertisingController::update
 * @see app/Http/Controllers/Admin/AdvertisingController.php:75
 * @route '/admin/advertising/campaigns/{campaign}'
 */
        updateForm.patch = (args: { campaign: string | number | { id: string | number } } | [campaign: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: update.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'PATCH',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    update.form = updateForm
const campaigns = {
    update: Object.assign(update, update),
}

export default campaigns