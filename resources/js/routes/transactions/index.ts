import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../wayfinder'
/**
* @see \App\Http\Controllers\TransactionController::show
 * @see app/Http/Controllers/TransactionController.php:42
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
 * @see app/Http/Controllers/TransactionController.php:42
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
 * @see app/Http/Controllers/TransactionController.php:42
 * @route '/transactions/{transaction}'
 */
show.get = (args: { transaction: number | { id: number } } | [transaction: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\TransactionController::show
 * @see app/Http/Controllers/TransactionController.php:42
 * @route '/transactions/{transaction}'
 */
show.head = (args: { transaction: number | { id: number } } | [transaction: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\TransactionController::show
 * @see app/Http/Controllers/TransactionController.php:42
 * @route '/transactions/{transaction}'
 */
    const showForm = (args: { transaction: number | { id: number } } | [transaction: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: show.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\TransactionController::show
 * @see app/Http/Controllers/TransactionController.php:42
 * @route '/transactions/{transaction}'
 */
        showForm.get = (args: { transaction: number | { id: number } } | [transaction: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: show.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\TransactionController::show
 * @see app/Http/Controllers/TransactionController.php:42
 * @route '/transactions/{transaction}'
 */
        showForm.head = (args: { transaction: number | { id: number } } | [transaction: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: show.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    show.form = showForm
/**
* @see \App\Http\Controllers\TransactionController::markAsPaid
 * @see app/Http/Controllers/TransactionController.php:51
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
 * @see app/Http/Controllers/TransactionController.php:51
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
 * @see app/Http/Controllers/TransactionController.php:51
 * @route '/transactions/{transaction}/mark-as-paid'
 */
markAsPaid.post = (args: { transaction: number | { id: number } } | [transaction: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: markAsPaid.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\TransactionController::markAsPaid
 * @see app/Http/Controllers/TransactionController.php:51
 * @route '/transactions/{transaction}/mark-as-paid'
 */
    const markAsPaidForm = (args: { transaction: number | { id: number } } | [transaction: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: markAsPaid.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\TransactionController::markAsPaid
 * @see app/Http/Controllers/TransactionController.php:51
 * @route '/transactions/{transaction}/mark-as-paid'
 */
        markAsPaidForm.post = (args: { transaction: number | { id: number } } | [transaction: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: markAsPaid.url(args, options),
            method: 'post',
        })
    
    markAsPaid.form = markAsPaidForm
/**
* @see \App\Http\Controllers\TransactionController::cancel
 * @see app/Http/Controllers/TransactionController.php:69
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
 * @see app/Http/Controllers/TransactionController.php:69
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
 * @see app/Http/Controllers/TransactionController.php:69
 * @route '/transactions/{transaction}/cancel'
 */
cancel.post = (args: { transaction: number | { id: number } } | [transaction: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: cancel.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\TransactionController::cancel
 * @see app/Http/Controllers/TransactionController.php:69
 * @route '/transactions/{transaction}/cancel'
 */
    const cancelForm = (args: { transaction: number | { id: number } } | [transaction: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: cancel.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\TransactionController::cancel
 * @see app/Http/Controllers/TransactionController.php:69
 * @route '/transactions/{transaction}/cancel'
 */
        cancelForm.post = (args: { transaction: number | { id: number } } | [transaction: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: cancel.url(args, options),
            method: 'post',
        })
    
    cancel.form = cancelForm
/**
* @see \App\Http\Controllers\TransactionController::markAsShipped
 * @see app/Http/Controllers/TransactionController.php:99
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
 * @see app/Http/Controllers/TransactionController.php:99
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
 * @see app/Http/Controllers/TransactionController.php:99
 * @route '/transactions/{transaction}/mark-as-shipped'
 */
markAsShipped.post = (args: { transaction: number | { id: number } } | [transaction: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: markAsShipped.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\TransactionController::markAsShipped
 * @see app/Http/Controllers/TransactionController.php:99
 * @route '/transactions/{transaction}/mark-as-shipped'
 */
    const markAsShippedForm = (args: { transaction: number | { id: number } } | [transaction: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: markAsShipped.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\TransactionController::markAsShipped
 * @see app/Http/Controllers/TransactionController.php:99
 * @route '/transactions/{transaction}/mark-as-shipped'
 */
        markAsShippedForm.post = (args: { transaction: number | { id: number } } | [transaction: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: markAsShipped.url(args, options),
            method: 'post',
        })
    
    markAsShipped.form = markAsShippedForm
/**
* @see \App\Http\Controllers\TransactionController::markAsReceived
 * @see app/Http/Controllers/TransactionController.php:124
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
 * @see app/Http/Controllers/TransactionController.php:124
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
 * @see app/Http/Controllers/TransactionController.php:124
 * @route '/transactions/{transaction}/mark-as-received'
 */
markAsReceived.post = (args: { transaction: number | { id: number } } | [transaction: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: markAsReceived.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\TransactionController::markAsReceived
 * @see app/Http/Controllers/TransactionController.php:124
 * @route '/transactions/{transaction}/mark-as-received'
 */
    const markAsReceivedForm = (args: { transaction: number | { id: number } } | [transaction: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: markAsReceived.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\TransactionController::markAsReceived
 * @see app/Http/Controllers/TransactionController.php:124
 * @route '/transactions/{transaction}/mark-as-received'
 */
        markAsReceivedForm.post = (args: { transaction: number | { id: number } } | [transaction: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: markAsReceived.url(args, options),
            method: 'post',
        })
    
    markAsReceived.form = markAsReceivedForm
/**
* @see \App\Http\Controllers\RatingController::rate
 * @see app/Http/Controllers/RatingController.php:11
 * @route '/transactions/{transaction}/rate'
 */
export const rate = (args: { transaction: number | { id: number } } | [transaction: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: rate.url(args, options),
    method: 'post',
})

rate.definition = {
    methods: ["post"],
    url: '/transactions/{transaction}/rate',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\RatingController::rate
 * @see app/Http/Controllers/RatingController.php:11
 * @route '/transactions/{transaction}/rate'
 */
rate.url = (args: { transaction: number | { id: number } } | [transaction: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
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

    return rate.definition.url
            .replace('{transaction}', parsedArgs.transaction.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\RatingController::rate
 * @see app/Http/Controllers/RatingController.php:11
 * @route '/transactions/{transaction}/rate'
 */
rate.post = (args: { transaction: number | { id: number } } | [transaction: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: rate.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\RatingController::rate
 * @see app/Http/Controllers/RatingController.php:11
 * @route '/transactions/{transaction}/rate'
 */
    const rateForm = (args: { transaction: number | { id: number } } | [transaction: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: rate.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\RatingController::rate
 * @see app/Http/Controllers/RatingController.php:11
 * @route '/transactions/{transaction}/rate'
 */
        rateForm.post = (args: { transaction: number | { id: number } } | [transaction: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: rate.url(args, options),
            method: 'post',
        })
    
    rate.form = rateForm
const transactions = {
    show: Object.assign(show, show),
markAsPaid: Object.assign(markAsPaid, markAsPaid),
cancel: Object.assign(cancel, cancel),
markAsShipped: Object.assign(markAsShipped, markAsShipped),
markAsReceived: Object.assign(markAsReceived, markAsReceived),
rate: Object.assign(rate, rate),
}

export default transactions