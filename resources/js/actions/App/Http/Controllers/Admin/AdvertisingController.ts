import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../../wayfinder'
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
/**
* @see \App\Http\Controllers\Admin\AdvertisingController::updateProfile
 * @see app/Http/Controllers/Admin/AdvertisingController.php:54
 * @route '/admin/advertising/profiles/{profile}'
 */
export const updateProfile = (args: { profile: string | number | { id: string | number } } | [profile: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: updateProfile.url(args, options),
    method: 'patch',
})

updateProfile.definition = {
    methods: ["patch"],
    url: '/admin/advertising/profiles/{profile}',
} satisfies RouteDefinition<["patch"]>

/**
* @see \App\Http\Controllers\Admin\AdvertisingController::updateProfile
 * @see app/Http/Controllers/Admin/AdvertisingController.php:54
 * @route '/admin/advertising/profiles/{profile}'
 */
updateProfile.url = (args: { profile: string | number | { id: string | number } } | [profile: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { profile: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { profile: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    profile: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        profile: typeof args.profile === 'object'
                ? args.profile.id
                : args.profile,
                }

    return updateProfile.definition.url
            .replace('{profile}', parsedArgs.profile.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\AdvertisingController::updateProfile
 * @see app/Http/Controllers/Admin/AdvertisingController.php:54
 * @route '/admin/advertising/profiles/{profile}'
 */
updateProfile.patch = (args: { profile: string | number | { id: string | number } } | [profile: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: updateProfile.url(args, options),
    method: 'patch',
})

    /**
* @see \App\Http\Controllers\Admin\AdvertisingController::updateProfile
 * @see app/Http/Controllers/Admin/AdvertisingController.php:54
 * @route '/admin/advertising/profiles/{profile}'
 */
    const updateProfileForm = (args: { profile: string | number | { id: string | number } } | [profile: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: updateProfile.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PATCH',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Admin\AdvertisingController::updateProfile
 * @see app/Http/Controllers/Admin/AdvertisingController.php:54
 * @route '/admin/advertising/profiles/{profile}'
 */
        updateProfileForm.patch = (args: { profile: string | number | { id: string | number } } | [profile: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: updateProfile.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'PATCH',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    updateProfile.form = updateProfileForm
/**
* @see \App\Http\Controllers\Admin\AdvertisingController::updateCampaign
 * @see app/Http/Controllers/Admin/AdvertisingController.php:75
 * @route '/admin/advertising/campaigns/{campaign}'
 */
export const updateCampaign = (args: { campaign: string | number | { id: string | number } } | [campaign: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: updateCampaign.url(args, options),
    method: 'patch',
})

updateCampaign.definition = {
    methods: ["patch"],
    url: '/admin/advertising/campaigns/{campaign}',
} satisfies RouteDefinition<["patch"]>

/**
* @see \App\Http\Controllers\Admin\AdvertisingController::updateCampaign
 * @see app/Http/Controllers/Admin/AdvertisingController.php:75
 * @route '/admin/advertising/campaigns/{campaign}'
 */
updateCampaign.url = (args: { campaign: string | number | { id: string | number } } | [campaign: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions) => {
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

    return updateCampaign.definition.url
            .replace('{campaign}', parsedArgs.campaign.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\AdvertisingController::updateCampaign
 * @see app/Http/Controllers/Admin/AdvertisingController.php:75
 * @route '/admin/advertising/campaigns/{campaign}'
 */
updateCampaign.patch = (args: { campaign: string | number | { id: string | number } } | [campaign: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: updateCampaign.url(args, options),
    method: 'patch',
})

    /**
* @see \App\Http\Controllers\Admin\AdvertisingController::updateCampaign
 * @see app/Http/Controllers/Admin/AdvertisingController.php:75
 * @route '/admin/advertising/campaigns/{campaign}'
 */
    const updateCampaignForm = (args: { campaign: string | number | { id: string | number } } | [campaign: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: updateCampaign.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PATCH',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Admin\AdvertisingController::updateCampaign
 * @see app/Http/Controllers/Admin/AdvertisingController.php:75
 * @route '/admin/advertising/campaigns/{campaign}'
 */
        updateCampaignForm.patch = (args: { campaign: string | number | { id: string | number } } | [campaign: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: updateCampaign.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'PATCH',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    updateCampaign.form = updateCampaignForm
const AdvertisingController = { index, updateProfile, updateCampaign }

export default AdvertisingController