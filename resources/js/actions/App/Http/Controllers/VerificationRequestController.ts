import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\VerificationRequestController::store
 * @see app/Http/Controllers/VerificationRequestController.php:13
 * @route '/verification/request'
 */
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/verification/request',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\VerificationRequestController::store
 * @see app/Http/Controllers/VerificationRequestController.php:13
 * @route '/verification/request'
 */
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\VerificationRequestController::store
 * @see app/Http/Controllers/VerificationRequestController.php:13
 * @route '/verification/request'
 */
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\VerificationRequestController::store
 * @see app/Http/Controllers/VerificationRequestController.php:13
 * @route '/verification/request'
 */
    const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: store.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\VerificationRequestController::store
 * @see app/Http/Controllers/VerificationRequestController.php:13
 * @route '/verification/request'
 */
        storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: store.url(options),
            method: 'post',
        })
    
    store.form = storeForm
/**
* @see \App\Http\Controllers\VerificationRequestController::index
 * @see app/Http/Controllers/VerificationRequestController.php:56
 * @route '/verification/status'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/verification/status',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\VerificationRequestController::index
 * @see app/Http/Controllers/VerificationRequestController.php:56
 * @route '/verification/status'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\VerificationRequestController::index
 * @see app/Http/Controllers/VerificationRequestController.php:56
 * @route '/verification/status'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\VerificationRequestController::index
 * @see app/Http/Controllers/VerificationRequestController.php:56
 * @route '/verification/status'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\VerificationRequestController::index
 * @see app/Http/Controllers/VerificationRequestController.php:56
 * @route '/verification/status'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\VerificationRequestController::index
 * @see app/Http/Controllers/VerificationRequestController.php:56
 * @route '/verification/status'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\VerificationRequestController::index
 * @see app/Http/Controllers/VerificationRequestController.php:56
 * @route '/verification/status'
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
* @see \App\Http\Controllers\VerificationRequestController::destroy
 * @see app/Http/Controllers/VerificationRequestController.php:70
 * @route '/verification/request/{id}'
 */
export const destroy = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/verification/request/{id}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\VerificationRequestController::destroy
 * @see app/Http/Controllers/VerificationRequestController.php:70
 * @route '/verification/request/{id}'
 */
destroy.url = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { id: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    id: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        id: args.id,
                }

    return destroy.definition.url
            .replace('{id}', parsedArgs.id.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\VerificationRequestController::destroy
 * @see app/Http/Controllers/VerificationRequestController.php:70
 * @route '/verification/request/{id}'
 */
destroy.delete = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

    /**
* @see \App\Http\Controllers\VerificationRequestController::destroy
 * @see app/Http/Controllers/VerificationRequestController.php:70
 * @route '/verification/request/{id}'
 */
    const destroyForm = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: destroy.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'DELETE',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\VerificationRequestController::destroy
 * @see app/Http/Controllers/VerificationRequestController.php:70
 * @route '/verification/request/{id}'
 */
        destroyForm.delete = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: destroy.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'DELETE',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    destroy.form = destroyForm
const VerificationRequestController = { store, index, destroy }

export default VerificationRequestController