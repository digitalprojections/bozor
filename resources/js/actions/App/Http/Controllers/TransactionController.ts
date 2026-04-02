import { queryParams, type RouteQueryOptions, type RouteDefinition, applyUrlDefaults } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\TransactionController::buyNow
 * @see app/Http/Controllers/TransactionController.php:12
 * @route '/listings/{listing}/buy-now'
 */
const buyNow33687d065ad1c1ef54d9a0573f623903 = (args: { listing: number | { id: number } } | [listing: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: buyNow33687d065ad1c1ef54d9a0573f623903.url(args, options),
    method: 'get',
})

buyNow33687d065ad1c1ef54d9a0573f623903.definition = {
    methods: ["get","head"],
    url: '/listings/{listing}/buy-now',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\TransactionController::buyNow
 * @see app/Http/Controllers/TransactionController.php:12
 * @route '/listings/{listing}/buy-now'
 */
buyNow33687d065ad1c1ef54d9a0573f623903.url = (args: { listing: number | { id: number } } | [listing: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { listing: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { listing: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    listing: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        listing: typeof args.listing === 'object'
                ? args.listing.id
                : args.listing,
                }

    return buyNow33687d065ad1c1ef54d9a0573f623903.definition.url
            .replace('{listing}', parsedArgs.listing.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\TransactionController::buyNow
 * @see app/Http/Controllers/TransactionController.php:12
 * @route '/listings/{listing}/buy-now'
 */
buyNow33687d065ad1c1ef54d9a0573f623903.get = (args: { listing: number | { id: number } } | [listing: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: buyNow33687d065ad1c1ef54d9a0573f623903.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\TransactionController::buyNow
 * @see app/Http/Controllers/TransactionController.php:12
 * @route '/listings/{listing}/buy-now'
 */
buyNow33687d065ad1c1ef54d9a0573f623903.head = (args: { listing: number | { id: number } } | [listing: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: buyNow33687d065ad1c1ef54d9a0573f623903.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\TransactionController::buyNow
 * @see app/Http/Controllers/TransactionController.php:12
 * @route '/listings/{listing}/buy-now'
 */
const buyNow33687d065ad1c1ef54d9a0573f623903 = (args: { listing: number | { id: number } } | [listing: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: buyNow33687d065ad1c1ef54d9a0573f623903.url(args, options),
    method: 'post',
})

buyNow33687d065ad1c1ef54d9a0573f623903.definition = {
    methods: ["post"],
    url: '/listings/{listing}/buy-now',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\TransactionController::buyNow
 * @see app/Http/Controllers/TransactionController.php:12
 * @route '/listings/{listing}/buy-now'
 */
buyNow33687d065ad1c1ef54d9a0573f623903.url = (args: { listing: number | { id: number } } | [listing: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { listing: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { listing: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    listing: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        listing: typeof args.listing === 'object'
                ? args.listing.id
                : args.listing,
                }

    return buyNow33687d065ad1c1ef54d9a0573f623903.definition.url
            .replace('{listing}', parsedArgs.listing.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\TransactionController::buyNow
 * @see app/Http/Controllers/TransactionController.php:12
 * @route '/listings/{listing}/buy-now'
 */
buyNow33687d065ad1c1ef54d9a0573f623903.post = (args: { listing: number | { id: number } } | [listing: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: buyNow33687d065ad1c1ef54d9a0573f623903.url(args, options),
    method: 'post',
})

export const buyNow = {
    '/listings/{listing}/buy-now': buyNow33687d065ad1c1ef54d9a0573f623903,
    '/listings/{listing}/buy-now': buyNow33687d065ad1c1ef54d9a0573f623903,
}

/**
* @see \App\Http\Controllers\TransactionController::markAsPaid
 * @see app/Http/Controllers/TransactionController.php:55
 * @route '/transactions/{transaction}/mark-as-paid'
 */
export const markAsPaid = (args: { transaction: number | { id: number } } | [transaction: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: markAsPaid.url(args, options),
    method: 'post',
})

markAsPaid.definition = {
    methods: ["post"],
    url: '/transactions/{transaction}/mark-as-paid',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\TransactionController::markAsPaid
 * @see app/Http/Controllers/TransactionController.php:55
 * @route '/transactions/{transaction}/mark-as-paid'
 */
markAsPaid.url = (args: { transaction: number | { id: number } } | [transaction: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { transaction: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { transaction: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    transaction: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        transaction: typeof args.transaction === 'object'
                ? args.transaction.id
                : args.transaction,
                }

    return markAsPaid.definition.url
            .replace('{transaction}', parsedArgs.transaction.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\TransactionController::markAsPaid
 * @see app/Http/Controllers/TransactionController.php:55
 * @route '/transactions/{transaction}/mark-as-paid'
 */
markAsPaid.post = (args: { transaction: number | { id: number } } | [transaction: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: markAsPaid.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\TransactionController::cancel
 * @see app/Http/Controllers/TransactionController.php:73
 * @route '/transactions/{transaction}/cancel'
 */
export const cancel = (args: { transaction: number | { id: number } } | [transaction: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: cancel.url(args, options),
    method: 'post',
})

cancel.definition = {
    methods: ["post"],
    url: '/transactions/{transaction}/cancel',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\TransactionController::cancel
 * @see app/Http/Controllers/TransactionController.php:73
 * @route '/transactions/{transaction}/cancel'
 */
cancel.url = (args: { transaction: number | { id: number } } | [transaction: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { transaction: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { transaction: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    transaction: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        transaction: typeof args.transaction === 'object'
                ? args.transaction.id
                : args.transaction,
                }

    return cancel.definition.url
            .replace('{transaction}', parsedArgs.transaction.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\TransactionController::cancel
 * @see app/Http/Controllers/TransactionController.php:73
 * @route '/transactions/{transaction}/cancel'
 */
cancel.post = (args: { transaction: number | { id: number } } | [transaction: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: cancel.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\TransactionController::markAsShipped
 * @see app/Http/Controllers/TransactionController.php:103
 * @route '/transactions/{transaction}/mark-as-shipped'
 */
export const markAsShipped = (args: { transaction: number | { id: number } } | [transaction: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: markAsShipped.url(args, options),
    method: 'post',
})

markAsShipped.definition = {
    methods: ["post"],
    url: '/transactions/{transaction}/mark-as-shipped',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\TransactionController::markAsShipped
 * @see app/Http/Controllers/TransactionController.php:103
 * @route '/transactions/{transaction}/mark-as-shipped'
 */
markAsShipped.url = (args: { transaction: number | { id: number } } | [transaction: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { transaction: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { transaction: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    transaction: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        transaction: typeof args.transaction === 'object'
                ? args.transaction.id
                : args.transaction,
                }

    return markAsShipped.definition.url
            .replace('{transaction}', parsedArgs.transaction.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\TransactionController::markAsShipped
 * @see app/Http/Controllers/TransactionController.php:103
 * @route '/transactions/{transaction}/mark-as-shipped'
 */
markAsShipped.post = (args: { transaction: number | { id: number } } | [transaction: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: markAsShipped.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\TransactionController::markAsReceived
 * @see app/Http/Controllers/TransactionController.php:128
 * @route '/transactions/{transaction}/mark-as-received'
 */
export const markAsReceived = (args: { transaction: number | { id: number } } | [transaction: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: markAsReceived.url(args, options),
    method: 'post',
})

markAsReceived.definition = {
    methods: ["post"],
    url: '/transactions/{transaction}/mark-as-received',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\TransactionController::markAsReceived
 * @see app/Http/Controllers/TransactionController.php:128
 * @route '/transactions/{transaction}/mark-as-received'
 */
markAsReceived.url = (args: { transaction: number | { id: number } } | [transaction: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { transaction: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { transaction: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    transaction: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        transaction: typeof args.transaction === 'object'
                ? args.transaction.id
                : args.transaction,
                }

    return markAsReceived.definition.url
            .replace('{transaction}', parsedArgs.transaction.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\TransactionController::markAsReceived
 * @see app/Http/Controllers/TransactionController.php:128
 * @route '/transactions/{transaction}/mark-as-received'
 */
markAsReceived.post = (args: { transaction: number | { id: number } } | [transaction: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: markAsReceived.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\TransactionController::show
 * @see app/Http/Controllers/TransactionController.php:46
 * @route '/transactions/{transaction}'
 */
export const show = (args: { transaction: number | { id: number } } | [transaction: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/transactions/{transaction}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\TransactionController::show
 * @see app/Http/Controllers/TransactionController.php:46
 * @route '/transactions/{transaction}'
 */
show.url = (args: { transaction: number | { id: number } } | [transaction: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { transaction: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { transaction: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    transaction: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        transaction: typeof args.transaction === 'object'
                ? args.transaction.id
                : args.transaction,
                }

    return show.definition.url
            .replace('{transaction}', parsedArgs.transaction.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\TransactionController::show
 * @see app/Http/Controllers/TransactionController.php:46
 * @route '/transactions/{transaction}'
 */
show.get = (args: { transaction: number | { id: number } } | [transaction: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\TransactionController::show
 * @see app/Http/Controllers/TransactionController.php:46
 * @route '/transactions/{transaction}'
 */
show.head = (args: { transaction: number | { id: number } } | [transaction: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})
const TransactionController = { buyNow, markAsPaid, cancel, markAsShipped, markAsReceived, show }

export default TransactionController