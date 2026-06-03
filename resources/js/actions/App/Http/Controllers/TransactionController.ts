import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\TransactionController::buyNow
 * @see app/Http/Controllers/TransactionController.php:17
 * @route '/listings/{listing}/buy-now'
 */
export const buyNow = (args: { listing: string | number | { id: string | number } } | [listing: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: buyNow.url(args, options),
    method: 'post',
})

buyNow.definition = {
    methods: ["post"],
    url: '/listings/{listing}/buy-now',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\TransactionController::buyNow
 * @see app/Http/Controllers/TransactionController.php:17
 * @route '/listings/{listing}/buy-now'
 */
buyNow.url = (args: { listing: string | number | { id: string | number } } | [listing: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions) => {
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

    return buyNow.definition.url
            .replace('{listing}', parsedArgs.listing.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\TransactionController::buyNow
 * @see app/Http/Controllers/TransactionController.php:17
 * @route '/listings/{listing}/buy-now'
 */
buyNow.post = (args: { listing: string | number | { id: string | number } } | [listing: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: buyNow.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\TransactionController::buyNow
 * @see app/Http/Controllers/TransactionController.php:17
 * @route '/listings/{listing}/buy-now'
 */
    const buyNowForm = (args: { listing: string | number | { id: string | number } } | [listing: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: buyNow.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\TransactionController::buyNow
 * @see app/Http/Controllers/TransactionController.php:17
 * @route '/listings/{listing}/buy-now'
 */
        buyNowForm.post = (args: { listing: string | number | { id: string | number } } | [listing: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: buyNow.url(args, options),
            method: 'post',
        })
    
    buyNow.form = buyNowForm
/**
* @see \App\Http\Controllers\TransactionController::markAsPaid
 * @see app/Http/Controllers/TransactionController.php:100
 * @route '/transactions/{transaction}/mark-as-paid'
 */
export const markAsPaid = (args: { transaction: string | number | { id: string | number } } | [transaction: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: markAsPaid.url(args, options),
    method: 'post',
})

markAsPaid.definition = {
    methods: ["post"],
    url: '/transactions/{transaction}/mark-as-paid',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\TransactionController::markAsPaid
 * @see app/Http/Controllers/TransactionController.php:100
 * @route '/transactions/{transaction}/mark-as-paid'
 */
markAsPaid.url = (args: { transaction: string | number | { id: string | number } } | [transaction: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions) => {
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
 * @see app/Http/Controllers/TransactionController.php:100
 * @route '/transactions/{transaction}/mark-as-paid'
 */
markAsPaid.post = (args: { transaction: string | number | { id: string | number } } | [transaction: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: markAsPaid.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\TransactionController::markAsPaid
 * @see app/Http/Controllers/TransactionController.php:100
 * @route '/transactions/{transaction}/mark-as-paid'
 */
    const markAsPaidForm = (args: { transaction: string | number | { id: string | number } } | [transaction: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: markAsPaid.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\TransactionController::markAsPaid
 * @see app/Http/Controllers/TransactionController.php:100
 * @route '/transactions/{transaction}/mark-as-paid'
 */
        markAsPaidForm.post = (args: { transaction: string | number | { id: string | number } } | [transaction: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: markAsPaid.url(args, options),
            method: 'post',
        })
    
    markAsPaid.form = markAsPaidForm
/**
* @see \App\Http\Controllers\TransactionController::cancel
 * @see app/Http/Controllers/TransactionController.php:120
 * @route '/transactions/{transaction}/cancel'
 */
export const cancel = (args: { transaction: string | number | { id: string | number } } | [transaction: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: cancel.url(args, options),
    method: 'post',
})

cancel.definition = {
    methods: ["post"],
    url: '/transactions/{transaction}/cancel',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\TransactionController::cancel
 * @see app/Http/Controllers/TransactionController.php:120
 * @route '/transactions/{transaction}/cancel'
 */
cancel.url = (args: { transaction: string | number | { id: string | number } } | [transaction: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions) => {
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
 * @see app/Http/Controllers/TransactionController.php:120
 * @route '/transactions/{transaction}/cancel'
 */
cancel.post = (args: { transaction: string | number | { id: string | number } } | [transaction: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: cancel.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\TransactionController::cancel
 * @see app/Http/Controllers/TransactionController.php:120
 * @route '/transactions/{transaction}/cancel'
 */
    const cancelForm = (args: { transaction: string | number | { id: string | number } } | [transaction: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: cancel.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\TransactionController::cancel
 * @see app/Http/Controllers/TransactionController.php:120
 * @route '/transactions/{transaction}/cancel'
 */
        cancelForm.post = (args: { transaction: string | number | { id: string | number } } | [transaction: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: cancel.url(args, options),
            method: 'post',
        })
    
    cancel.form = cancelForm
/**
* @see \App\Http\Controllers\TransactionController::markAsShipped
 * @see app/Http/Controllers/TransactionController.php:157
 * @route '/transactions/{transaction}/mark-as-shipped'
 */
export const markAsShipped = (args: { transaction: string | number | { id: string | number } } | [transaction: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: markAsShipped.url(args, options),
    method: 'post',
})

markAsShipped.definition = {
    methods: ["post"],
    url: '/transactions/{transaction}/mark-as-shipped',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\TransactionController::markAsShipped
 * @see app/Http/Controllers/TransactionController.php:157
 * @route '/transactions/{transaction}/mark-as-shipped'
 */
markAsShipped.url = (args: { transaction: string | number | { id: string | number } } | [transaction: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions) => {
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
 * @see app/Http/Controllers/TransactionController.php:157
 * @route '/transactions/{transaction}/mark-as-shipped'
 */
markAsShipped.post = (args: { transaction: string | number | { id: string | number } } | [transaction: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: markAsShipped.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\TransactionController::markAsShipped
 * @see app/Http/Controllers/TransactionController.php:157
 * @route '/transactions/{transaction}/mark-as-shipped'
 */
    const markAsShippedForm = (args: { transaction: string | number | { id: string | number } } | [transaction: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: markAsShipped.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\TransactionController::markAsShipped
 * @see app/Http/Controllers/TransactionController.php:157
 * @route '/transactions/{transaction}/mark-as-shipped'
 */
        markAsShippedForm.post = (args: { transaction: string | number | { id: string | number } } | [transaction: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: markAsShipped.url(args, options),
            method: 'post',
        })
    
    markAsShipped.form = markAsShippedForm
/**
* @see \App\Http\Controllers\TransactionController::markAsReceived
 * @see app/Http/Controllers/TransactionController.php:195
 * @route '/transactions/{transaction}/mark-as-received'
 */
export const markAsReceived = (args: { transaction: string | number | { id: string | number } } | [transaction: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: markAsReceived.url(args, options),
    method: 'post',
})

markAsReceived.definition = {
    methods: ["post"],
    url: '/transactions/{transaction}/mark-as-received',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\TransactionController::markAsReceived
 * @see app/Http/Controllers/TransactionController.php:195
 * @route '/transactions/{transaction}/mark-as-received'
 */
markAsReceived.url = (args: { transaction: string | number | { id: string | number } } | [transaction: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions) => {
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
 * @see app/Http/Controllers/TransactionController.php:195
 * @route '/transactions/{transaction}/mark-as-received'
 */
markAsReceived.post = (args: { transaction: string | number | { id: string | number } } | [transaction: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: markAsReceived.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\TransactionController::markAsReceived
 * @see app/Http/Controllers/TransactionController.php:195
 * @route '/transactions/{transaction}/mark-as-received'
 */
    const markAsReceivedForm = (args: { transaction: string | number | { id: string | number } } | [transaction: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: markAsReceived.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\TransactionController::markAsReceived
 * @see app/Http/Controllers/TransactionController.php:195
 * @route '/transactions/{transaction}/mark-as-received'
 */
        markAsReceivedForm.post = (args: { transaction: string | number | { id: string | number } } | [transaction: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: markAsReceived.url(args, options),
            method: 'post',
        })
    
    markAsReceived.form = markAsReceivedForm
/**
* @see \App\Http\Controllers\TransactionController::consolidatePackages
 * @see app/Http/Controllers/TransactionController.php:225
 * @route '/transactions/packages/consolidate'
 */
export const consolidatePackages = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: consolidatePackages.url(options),
    method: 'post',
})

consolidatePackages.definition = {
    methods: ["post"],
    url: '/transactions/packages/consolidate',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\TransactionController::consolidatePackages
 * @see app/Http/Controllers/TransactionController.php:225
 * @route '/transactions/packages/consolidate'
 */
consolidatePackages.url = (options?: RouteQueryOptions) => {
    return consolidatePackages.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\TransactionController::consolidatePackages
 * @see app/Http/Controllers/TransactionController.php:225
 * @route '/transactions/packages/consolidate'
 */
consolidatePackages.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: consolidatePackages.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\TransactionController::consolidatePackages
 * @see app/Http/Controllers/TransactionController.php:225
 * @route '/transactions/packages/consolidate'
 */
    const consolidatePackagesForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: consolidatePackages.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\TransactionController::consolidatePackages
 * @see app/Http/Controllers/TransactionController.php:225
 * @route '/transactions/packages/consolidate'
 */
        consolidatePackagesForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: consolidatePackages.url(options),
            method: 'post',
        })
    
    consolidatePackages.form = consolidatePackagesForm
/**
* @see \App\Http\Controllers\TransactionController::show
 * @see app/Http/Controllers/TransactionController.php:56
 * @route '/transactions/{transaction}'
 */
export const show = (args: { transaction: string | number | { id: string | number } } | [transaction: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/transactions/{transaction}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\TransactionController::show
 * @see app/Http/Controllers/TransactionController.php:56
 * @route '/transactions/{transaction}'
 */
show.url = (args: { transaction: string | number | { id: string | number } } | [transaction: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions) => {
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
 * @see app/Http/Controllers/TransactionController.php:56
 * @route '/transactions/{transaction}'
 */
show.get = (args: { transaction: string | number | { id: string | number } } | [transaction: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\TransactionController::show
 * @see app/Http/Controllers/TransactionController.php:56
 * @route '/transactions/{transaction}'
 */
show.head = (args: { transaction: string | number | { id: string | number } } | [transaction: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\TransactionController::show
 * @see app/Http/Controllers/TransactionController.php:56
 * @route '/transactions/{transaction}'
 */
    const showForm = (args: { transaction: string | number | { id: string | number } } | [transaction: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: show.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\TransactionController::show
 * @see app/Http/Controllers/TransactionController.php:56
 * @route '/transactions/{transaction}'
 */
        showForm.get = (args: { transaction: string | number | { id: string | number } } | [transaction: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: show.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\TransactionController::show
 * @see app/Http/Controllers/TransactionController.php:56
 * @route '/transactions/{transaction}'
 */
        showForm.head = (args: { transaction: string | number | { id: string | number } } | [transaction: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: show.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    show.form = showForm
const TransactionController = { buyNow, markAsPaid, cancel, markAsShipped, markAsReceived, consolidatePackages, show }

export default TransactionController