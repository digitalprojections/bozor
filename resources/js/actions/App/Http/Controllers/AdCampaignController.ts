import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\AdCampaignController::create
 * @see app/Http/Controllers/AdCampaignController.php:16
 * @route '/advertising/campaigns/create'
 */
export const create = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})

create.definition = {
    methods: ["get","head"],
    url: '/advertising/campaigns/create',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\AdCampaignController::create
 * @see app/Http/Controllers/AdCampaignController.php:16
 * @route '/advertising/campaigns/create'
 */
create.url = (options?: RouteQueryOptions) => {
    return create.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\AdCampaignController::create
 * @see app/Http/Controllers/AdCampaignController.php:16
 * @route '/advertising/campaigns/create'
 */
create.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\AdCampaignController::create
 * @see app/Http/Controllers/AdCampaignController.php:16
 * @route '/advertising/campaigns/create'
 */
create.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: create.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\AdCampaignController::create
 * @see app/Http/Controllers/AdCampaignController.php:16
 * @route '/advertising/campaigns/create'
 */
    const createForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: create.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\AdCampaignController::create
 * @see app/Http/Controllers/AdCampaignController.php:16
 * @route '/advertising/campaigns/create'
 */
        createForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: create.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\AdCampaignController::create
 * @see app/Http/Controllers/AdCampaignController.php:16
 * @route '/advertising/campaigns/create'
 */
        createForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: create.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    create.form = createForm
/**
* @see \App\Http\Controllers\AdCampaignController::store
 * @see app/Http/Controllers/AdCampaignController.php:27
 * @route '/advertising/campaigns'
 */
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/advertising/campaigns',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\AdCampaignController::store
 * @see app/Http/Controllers/AdCampaignController.php:27
 * @route '/advertising/campaigns'
 */
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\AdCampaignController::store
 * @see app/Http/Controllers/AdCampaignController.php:27
 * @route '/advertising/campaigns'
 */
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\AdCampaignController::store
 * @see app/Http/Controllers/AdCampaignController.php:27
 * @route '/advertising/campaigns'
 */
    const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: store.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\AdCampaignController::store
 * @see app/Http/Controllers/AdCampaignController.php:27
 * @route '/advertising/campaigns'
 */
        storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: store.url(options),
            method: 'post',
        })
    
    store.form = storeForm
/**
* @see \App\Http\Controllers\AdCampaignController::submitPayment
 * @see app/Http/Controllers/AdCampaignController.php:76
 * @route '/advertising/campaigns/{campaign}/payment'
 */
export const submitPayment = (args: { campaign: string | number | { id: string | number } } | [campaign: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: submitPayment.url(args, options),
    method: 'post',
})

submitPayment.definition = {
    methods: ["post"],
    url: '/advertising/campaigns/{campaign}/payment',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\AdCampaignController::submitPayment
 * @see app/Http/Controllers/AdCampaignController.php:76
 * @route '/advertising/campaigns/{campaign}/payment'
 */
submitPayment.url = (args: { campaign: string | number | { id: string | number } } | [campaign: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions) => {
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

    return submitPayment.definition.url
            .replace('{campaign}', parsedArgs.campaign.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\AdCampaignController::submitPayment
 * @see app/Http/Controllers/AdCampaignController.php:76
 * @route '/advertising/campaigns/{campaign}/payment'
 */
submitPayment.post = (args: { campaign: string | number | { id: string | number } } | [campaign: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: submitPayment.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\AdCampaignController::submitPayment
 * @see app/Http/Controllers/AdCampaignController.php:76
 * @route '/advertising/campaigns/{campaign}/payment'
 */
    const submitPaymentForm = (args: { campaign: string | number | { id: string | number } } | [campaign: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: submitPayment.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\AdCampaignController::submitPayment
 * @see app/Http/Controllers/AdCampaignController.php:76
 * @route '/advertising/campaigns/{campaign}/payment'
 */
        submitPaymentForm.post = (args: { campaign: string | number | { id: string | number } } | [campaign: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: submitPayment.url(args, options),
            method: 'post',
        })
    
    submitPayment.form = submitPaymentForm
/**
* @see \App\Http\Controllers\AdCampaignController::destroy
 * @see app/Http/Controllers/AdCampaignController.php:96
 * @route '/advertising/campaigns/{campaign}'
 */
export const destroy = (args: { campaign: string | number | { id: string | number } } | [campaign: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/advertising/campaigns/{campaign}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\AdCampaignController::destroy
 * @see app/Http/Controllers/AdCampaignController.php:96
 * @route '/advertising/campaigns/{campaign}'
 */
destroy.url = (args: { campaign: string | number | { id: string | number } } | [campaign: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions) => {
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

    return destroy.definition.url
            .replace('{campaign}', parsedArgs.campaign.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\AdCampaignController::destroy
 * @see app/Http/Controllers/AdCampaignController.php:96
 * @route '/advertising/campaigns/{campaign}'
 */
destroy.delete = (args: { campaign: string | number | { id: string | number } } | [campaign: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

    /**
* @see \App\Http\Controllers\AdCampaignController::destroy
 * @see app/Http/Controllers/AdCampaignController.php:96
 * @route '/advertising/campaigns/{campaign}'
 */
    const destroyForm = (args: { campaign: string | number | { id: string | number } } | [campaign: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: destroy.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'DELETE',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\AdCampaignController::destroy
 * @see app/Http/Controllers/AdCampaignController.php:96
 * @route '/advertising/campaigns/{campaign}'
 */
        destroyForm.delete = (args: { campaign: string | number | { id: string | number } } | [campaign: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: destroy.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'DELETE',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    destroy.form = destroyForm
const AdCampaignController = { create, store, submitPayment, destroy }

export default AdCampaignController