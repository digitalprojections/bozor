import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\Admin\AdvertisingController::update
 * @see app/Http/Controllers/Admin/AdvertisingController.php:54
 * @route '/admin/advertising/profiles/{profile}'
 */
export const update = (args: { profile: string | number | { id: string | number } } | [profile: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update.url(args, options),
    method: 'patch',
})

update.definition = {
    methods: ["patch"],
    url: '/admin/advertising/profiles/{profile}',
} satisfies RouteDefinition<["patch"]>

/**
* @see \App\Http\Controllers\Admin\AdvertisingController::update
 * @see app/Http/Controllers/Admin/AdvertisingController.php:54
 * @route '/admin/advertising/profiles/{profile}'
 */
update.url = (args: { profile: string | number | { id: string | number } } | [profile: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions) => {
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

    return update.definition.url
            .replace('{profile}', parsedArgs.profile.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\AdvertisingController::update
 * @see app/Http/Controllers/Admin/AdvertisingController.php:54
 * @route '/admin/advertising/profiles/{profile}'
 */
update.patch = (args: { profile: string | number | { id: string | number } } | [profile: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update.url(args, options),
    method: 'patch',
})

    /**
* @see \App\Http\Controllers\Admin\AdvertisingController::update
 * @see app/Http/Controllers/Admin/AdvertisingController.php:54
 * @route '/admin/advertising/profiles/{profile}'
 */
    const updateForm = (args: { profile: string | number | { id: string | number } } | [profile: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
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
 * @see app/Http/Controllers/Admin/AdvertisingController.php:54
 * @route '/admin/advertising/profiles/{profile}'
 */
        updateForm.patch = (args: { profile: string | number | { id: string | number } } | [profile: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: update.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'PATCH',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    update.form = updateForm
const profiles = {
    update: Object.assign(update, update),
}

export default profiles