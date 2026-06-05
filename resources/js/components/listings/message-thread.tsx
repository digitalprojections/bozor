import React from 'react';
import { router, useForm, usePage } from '@inertiajs/react';
import { MessageCircle, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { useTranslations } from '@/hooks/use-translations';

export interface ListingMessage {
    id: number;
    listing_id: number;
    transaction_id: number | null;
    question: string;
    answer: string | null;
    answered_at: string | null;
    created_at: string;
    questioner: {
        id: number;
        name: string;
        avatar_url: string;
    };
    seller: {
        id: number;
        name: string;
        avatar_url: string;
    };
}

interface MessageThreadProps {
    messages: ListingMessage[];
    listingId?: number;
    transactionId?: number;
    sellerId: number;
    buyerId?: number;
    privateThread?: boolean;
}

export function MessageThread({
    messages,
    listingId,
    transactionId,
    sellerId,
    buyerId,
    privateThread = false,
}: MessageThreadProps) {
    const { t } = useTranslations();
    const { auth } = usePage().props as any;
    const user = auth?.user && !auth.user.is_guest ? auth.user : null;
    const isSeller = user && Number(user.id) === Number(sellerId);
    const isBuyer = user && buyerId && Number(user.id) === Number(buyerId);
    const canAsk = Boolean(user && !isSeller && (!privateThread || isBuyer));

    React.useEffect(() => {
        if (!user) {
            return;
        }

        const timer = window.setInterval(() => {
            router.reload({
                only: transactionId
                    ? ['transaction', 'unreadMessageNotificationsCount']
                    : ['messages', 'unreadMessageNotificationsCount'],
            });
        }, 5000);

        return () => window.clearInterval(timer);
    }, [transactionId, user?.id]);

    return (
        <Card className="rounded-[16px] border-[#edf2f9] shadow-sm sm:rounded-[24px]">
            <CardHeader className="px-5 pt-6 pb-2 sm:px-8 sm:pt-8">
                <h2 className="flex flex-row items-center gap-2 text-lg font-bold text-[#0b1b32]">
                    <MessageCircle size={20} className="text-[#0d9488]" />
                    {privateThread
                        ? t('messages.private_title') || 'Buyer and Seller Messages'
                        : t('messages.public_title') || 'Questions and Answers'}
                </h2>
            </CardHeader>
            <CardContent className="flex flex-col gap-4 p-5 pt-2 sm:p-8 sm:pt-4">
                {messages.length > 0 ? (
                    <div className="flex flex-col gap-3">
                        {messages.map((message) => (
                            <div
                                key={message.id}
                                className="rounded-[14px] border border-[#edf2f9] bg-[#f8fbfe] p-4"
                            >
                                <div className="flex flex-col gap-3">
                                    <MessageBubble
                                        label={message.questioner.name}
                                        body={message.question}
                                        date={message.created_at}
                                    />

                                    {message.answer ? (
                                        <MessageBubble
                                            label={message.seller.name}
                                            body={message.answer}
                                            date={message.answered_at}
                                            answer
                                        />
                                    ) : isSeller ? (
                                        <AnswerForm messageId={message.id} />
                                    ) : (
                                        <div className="rounded-lg border border-dashed border-[#d6e1ef] bg-white px-3 py-2 text-sm font-medium text-[#64748b]">
                                            {t('messages.awaiting_answer') ||
                                                'Awaiting seller answer'}
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="rounded-[14px] border border-dashed border-[#d6e1ef] bg-[#f8fbfe] p-4 text-sm font-medium text-[#64748b]">
                        {t('messages.empty') || 'No messages yet.'}
                    </div>
                )}

                {canAsk && (
                    <QuestionForm
                        action={
                            transactionId
                                ? `/transactions/${transactionId}/messages`
                                : `/listings/${listingId}/messages`
                        }
                    />
                )}
            </CardContent>
        </Card>
    );
}

function MessageBubble({
    label,
    body,
    date,
    answer = false,
}: {
    label: string;
    body: string;
    date: string | null;
    answer?: boolean;
}) {
    return (
        <div className="flex flex-col gap-1">
            <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs font-bold text-[#64748b]">
                <span>{answer ? 'A' : 'Q'}.</span>
                <span>{label}</span>
                {date && (
                    <span className="font-medium text-[#94a3b8]">
                        {new Date(date).toLocaleString()}
                    </span>
                )}
            </div>
            <div className="whitespace-pre-wrap rounded-lg bg-white p-3 text-sm leading-relaxed text-[#1d2b41]">
                {body}
            </div>
        </div>
    );
}

function QuestionForm({ action }: { action: string }) {
    const { t } = useTranslations();
    const form = useForm({ question: '' });

    const submit = (event: React.FormEvent) => {
        event.preventDefault();
        form.post(action, {
            preserveScroll: true,
            onSuccess: () => form.reset(),
        });
    };

    return (
        <form onSubmit={submit} className="flex flex-col gap-3">
            <Textarea
                value={form.data.question}
                onChange={(event) => form.setData('question', event.target.value)}
                placeholder={t('messages.question_placeholder') || 'Ask a question'}
                className="min-h-24 rounded-xl border-[#d6e1ef] bg-white"
            />
            {form.errors.question && (
                <p className="text-xs font-medium text-red-600">
                    {form.errors.question}
                </p>
            )}
            <Button
                type="submit"
                disabled={form.processing}
                className="w-fit rounded-xl bg-[#0d9488] px-5 text-white hover:bg-[#0f766e]"
            >
                <Send className="mr-2" size={16} />
                {t('messages.send') || 'Send'}
            </Button>
        </form>
    );
}

function AnswerForm({ messageId }: { messageId: number }) {
    const { t } = useTranslations();
    const form = useForm({ answer: '' });

    const submit = (event: React.FormEvent) => {
        event.preventDefault();
        form.patch(`/listing-messages/${messageId}/answer`, {
            preserveScroll: true,
            onSuccess: () => form.reset(),
        });
    };

    return (
        <form onSubmit={submit} className="flex flex-col gap-3">
            <Textarea
                value={form.data.answer}
                onChange={(event) => form.setData('answer', event.target.value)}
                placeholder={t('messages.answer_placeholder') || 'Write an answer'}
                className="min-h-20 rounded-xl border-[#d6e1ef] bg-white"
            />
            {form.errors.answer && (
                <p className="text-xs font-medium text-red-600">
                    {form.errors.answer}
                </p>
            )}
            <Button
                type="submit"
                disabled={form.processing}
                variant="outline"
                className="w-fit rounded-xl border-[#0d9488] px-5 text-[#0d9488]"
            >
                {t('messages.answer') || 'Answer'}
            </Button>
        </form>
    );
}
