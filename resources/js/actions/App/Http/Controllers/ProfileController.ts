import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\ProfileController::follow
 * @see app/Http/Controllers/ProfileController.php:91
 * @route '/users/{user}/follow'
 */
export const follow = (args: { user: string | number | { id: string | number } } | [user: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: follow.url(args, options),
    method: 'post',
})

follow.definition = {
    methods: ["post"],
    url: '/users/{user}/follow',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\ProfileController::follow
 * @see app/Http/Controllers/ProfileController.php:91
 * @route '/users/{user}/follow'
 */
follow.url = (args: { user: string | number | { id: string | number } } | [user: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { user: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { user: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    user: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        user: typeof args.user === 'object'
                ? args.user.id
                : args.user,
                }

    return follow.definition.url
            .replace('{user}', parsedArgs.user.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\ProfileController::follow
 * @see app/Http/Controllers/ProfileController.php:91
 * @route '/users/{user}/follow'
 */
follow.post = (args: { user: string | number | { id: string | number } } | [user: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: follow.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\ProfileController::follow
 * @see app/Http/Controllers/ProfileController.php:91
 * @route '/users/{user}/follow'
 */
    const followForm = (args: { user: string | number | { id: string | number } } | [user: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: follow.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\ProfileController::follow
 * @see app/Http/Controllers/ProfileController.php:91
 * @route '/users/{user}/follow'
 */
        followForm.post = (args: { user: string | number | { id: string | number } } | [user: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: follow.url(args, options),
            method: 'post',
        })
    
    follow.form = followForm
/**
* @see \App\Http\Controllers\ProfileController::unfollow
 * @see app/Http/Controllers/ProfileController.php:110
 * @route '/users/{user}/follow'
 */
export const unfollow = (args: { user: string | number | { id: string | number } } | [user: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: unfollow.url(args, options),
    method: 'delete',
})

unfollow.definition = {
    methods: ["delete"],
    url: '/users/{user}/follow',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\ProfileController::unfollow
 * @see app/Http/Controllers/ProfileController.php:110
 * @route '/users/{user}/follow'
 */
unfollow.url = (args: { user: string | number | { id: string | number } } | [user: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { user: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { user: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    user: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        user: typeof args.user === 'object'
                ? args.user.id
                : args.user,
                }

    return unfollow.definition.url
            .replace('{user}', parsedArgs.user.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\ProfileController::unfollow
 * @see app/Http/Controllers/ProfileController.php:110
 * @route '/users/{user}/follow'
 */
unfollow.delete = (args: { user: string | number | { id: string | number } } | [user: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: unfollow.url(args, options),
    method: 'delete',
})

    /**
* @see \App\Http\Controllers\ProfileController::unfollow
 * @see app/Http/Controllers/ProfileController.php:110
 * @route '/users/{user}/follow'
 */
    const unfollowForm = (args: { user: string | number | { id: string | number } } | [user: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: unfollow.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'DELETE',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\ProfileController::unfollow
 * @see app/Http/Controllers/ProfileController.php:110
 * @route '/users/{user}/follow'
 */
        unfollowForm.delete = (args: { user: string | number | { id: string | number } } | [user: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: unfollow.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'DELETE',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    unfollow.form = unfollowForm
/**
* @see \App\Http\Controllers\ProfileController::show
 * @see app/Http/Controllers/ProfileController.php:16
 * @route '/users/{user}'
 */
export const show = (args: { user: string | number | { id: string | number } } | [user: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/users/{user}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\ProfileController::show
 * @see app/Http/Controllers/ProfileController.php:16
 * @route '/users/{user}'
 */
show.url = (args: { user: string | number | { id: string | number } } | [user: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { user: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { user: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    user: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        user: typeof args.user === 'object'
                ? args.user.id
                : args.user,
                }

    return show.definition.url
            .replace('{user}', parsedArgs.user.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\ProfileController::show
 * @see app/Http/Controllers/ProfileController.php:16
 * @route '/users/{user}'
 */
show.get = (args: { user: string | number | { id: string | number } } | [user: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\ProfileController::show
 * @see app/Http/Controllers/ProfileController.php:16
 * @route '/users/{user}'
 */
show.head = (args: { user: string | number | { id: string | number } } | [user: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\ProfileController::show
 * @see app/Http/Controllers/ProfileController.php:16
 * @route '/users/{user}'
 */
    const showForm = (args: { user: string | number | { id: string | number } } | [user: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: show.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\ProfileController::show
 * @see app/Http/Controllers/ProfileController.php:16
 * @route '/users/{user}'
 */
        showForm.get = (args: { user: string | number | { id: string | number } } | [user: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: show.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\ProfileController::show
 * @see app/Http/Controllers/ProfileController.php:16
 * @route '/users/{user}'
 */
        showForm.head = (args: { user: string | number | { id: string | number } } | [user: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: show.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    show.form = showForm
const ProfileController = { follow, unfollow, show }

export default ProfileController