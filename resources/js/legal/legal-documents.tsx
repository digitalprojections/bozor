import React, { type ReactNode } from 'react';

type TranslationFunction = (key: string) => string;

export interface LegalDocument {
    title: string;
    lastUpdated: string;
    content: ReactNode;
}

function Section({ title, children }: { title: string; children: ReactNode }) {
    return (
        <section>
            <h2 className="mb-4 border-b pb-2 text-xl font-bold">{title}</h2>
            {children}
        </section>
    );
}

function WarningNotice({ children }: { children: ReactNode }) {
    return (
        <section className="rounded-lg border border-amber-200 bg-amber-50 p-4">
            {children}
        </section>
    );
}

function InfoNotice({ children }: { children: ReactNode }) {
    return (
        <div className="rounded-lg border border-[#d1e2fc] bg-[#f3f9ff] p-4 italic">
            {children}
        </div>
    );
}

export function getTermsDocument(
    locale: string,
    t: TranslationFunction,
): LegalDocument {
    return locale === 'en' ? englishTerms(t) : legacyTerms(t);
}

export function getPrivacyDocument(
    locale: string,
    t: TranslationFunction,
): LegalDocument {
    return locale === 'en' ? englishPrivacy(t) : legacyPrivacy(t);
}

function englishTerms(t: TranslationFunction): LegalDocument {
    const appName = t('common.app_name');
    const platformNotice = t('terms.platform_free_notice');

    return {
        title: t('terms.title'),
        lastUpdated: 'May 31, 2026',
        content: (
            <>
                <Section title="1. Introduction">
                    <p>
                        These Terms of Use govern your access to and use of{' '}
                        {appName}. By creating an account, browsing listings,
                        posting items, bidding, buying, selling, messaging, or
                        otherwise using the platform, you agree to these terms
                        and to our Privacy Policy.
                    </p>
                    <p>
                        If you do not agree to these terms, you must not use the
                        platform.
                    </p>
                </Section>

                <Section title="2. Marketplace Role">
                    <p>
                        {appName} is an online venue that helps users discover
                        listings and communicate about marketplace transactions.
                        We are not a seller, buyer, auctioneer, broker, escrow
                        agent, payment processor, shipping provider, or party to
                        any transaction between users.
                    </p>
                    <p>
                        Users are solely responsible for evaluating listings,
                        agreeing on transaction terms, completing payment and
                        delivery, handling taxes or customs obligations, and
                        resolving disputes with each other.
                    </p>
                </Section>

                <Section title="3. Accounts and Eligibility">
                    <p>
                        You must provide accurate account information and keep
                        your login credentials secure. You are responsible for
                        all activity under your account.
                    </p>
                    <p>
                        You may not use the platform if you are legally
                        prohibited from doing so, if we have suspended or
                        removed your account, or if your use would violate
                        applicable law.
                    </p>
                </Section>

                <Section title="4. Listings and User Content">
                    <p>
                        You are responsible for the listings, photos,
                        descriptions, profile information, messages, ratings,
                        and other content you submit. Your content must be
                        accurate, lawful, non-infringing, and not misleading.
                    </p>
                    <p>
                        You grant us a non-exclusive, worldwide, royalty-free
                        license to host, store, reproduce, display, and use your
                        content as needed to operate, promote, protect, and
                        improve the platform.
                    </p>
                    <p>
                        We may remove or restrict content at any time if we
                        believe it violates these terms, creates risk, or harms
                        the platform or its users.
                    </p>
                </Section>

                <Section title="5. Prohibited Conduct">
                    <p>
                        You must not post, sell, buy, request, or promote
                        illegal, stolen, counterfeit, unsafe, regulated,
                        infringing, deceptive, offensive, or otherwise harmful
                        items or content. You must not harass others, manipulate
                        bids or ratings, impersonate another person, evade
                        enforcement, scrape the platform, interfere with
                        security, introduce malware, spam users, or use the
                        platform for fraud or other unlawful activity.
                    </p>
                </Section>

                <Section title="6. Transactions, Payments, and Delivery">
                    <p>
                        Buyers and sellers decide whether and how to complete
                        each transaction. Unless we clearly state otherwise in a
                        separate written policy, all payments, refunds,
                        cancellations, shipping, pickup, inspection, returns,
                        warranties, and after-sale support are handled directly
                        between the users involved.
                    </p>
                    <p>
                        We do not guarantee item quality, authenticity,
                        legality, safety, availability, delivery, payment, or
                        any user's identity, ability, or intent to complete a
                        transaction.
                    </p>
                </Section>

                <Section title="7. Fees">
                    <p>
                        The core marketplace is currently free to use. We may
                        introduce paid features, advertising, subscriptions,
                        commissions, or other fees in the future. If we do, we
                        will provide the applicable terms before charging you.
                    </p>
                </Section>

                <WarningNotice>
                    <h2 className="mb-2 text-xl font-bold">
                        8. User Responsibility and Risk
                    </h2>
                    <div className="leading-relaxed font-bold text-amber-900">
                        <p>
                            THIS PLATFORM IS PROVIDED "AS IS" AND "AS
                            AVAILABLE."
                        </p>
                        <p className="mt-2 text-lg">{platformNotice}</p>
                        <p className="mt-2">
                            TO THE MAXIMUM EXTENT PERMITTED BY LAW, WE DISCLAIM
                            ALL WARRANTIES AND ARE NOT LIABLE FOR LOSSES,
                            DISPUTES, FAILED TRANSACTIONS, ITEM DEFECTS, USER
                            CONDUCT, LOST PROFITS, DATA LOSS, OR INDIRECT,
                            INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE
                            DAMAGES ARISING FROM OR RELATED TO YOUR USE OF THE
                            PLATFORM.
                        </p>
                    </div>
                </WarningNotice>

                <Section title="9. Safety and Disputes Between Users">
                    <p>
                        Use reasonable care when communicating, meeting, paying,
                        shipping, or exchanging items. We may provide tools for
                        reporting abuse or suspicious activity, but we are not
                        obligated to mediate or resolve user disputes.
                    </p>
                </Section>

                <Section title="10. Suspension and Termination">
                    <p>
                        We may limit, suspend, or terminate your access to the
                        platform, remove content, or take other protective
                        action at any time if we believe you violated these
                        terms, created risk, caused harm, or misused the
                        platform.
                    </p>
                    <p>
                        You may stop using the platform at any time. Sections
                        intended to survive termination, including
                        responsibility, disclaimers, limitations of liability,
                        and dispute terms, will continue to apply.
                    </p>
                </Section>

                <Section title="11. Changes to These Terms">
                    <p>
                        We may update these terms from time to time. The updated
                        version will be posted on this page with a new "Last
                        updated" date. Your continued use of the platform after
                        changes become effective means you accept the updated
                        terms.
                    </p>
                </Section>

                <Section title="12. Contact">
                    <p>
                        If you have questions about these terms or need to
                        report a concern, please contact us through the support
                        or contact channel provided on the platform.
                    </p>
                </Section>
            </>
        ),
    };
}

function legacyTerms(t: TranslationFunction): LegalDocument {
    const appName = t('common.app_name');
    const platformNotice = t('terms.platform_free_notice');

    return {
        title: t('terms.title'),
        lastUpdated: 'April 1, 2026',
        content: (
            <>
                <Section title="1. Acceptable Use">
                    <p>
                        By using {appName}, you agree to use the platform only
                        for lawful purposes. You are prohibited from posting
                        illegal, offensive, or fraudulent content. We reserve
                        the right to remove any listing or user that violates
                        these terms.
                    </p>
                </Section>

                <Section title="2. Marketplace Transactions">
                    <p>
                        {appName} provides a venue for users to connect. We do
                        not participate in, guarantee, or assume liability for
                        any transaction between buyers and sellers. All deals
                        are made directly between the parties involved.
                    </p>
                </Section>

                <WarningNotice>
                    <h2 className="mb-2 text-xl font-bold">
                        3. User Responsibility & Liability
                    </h2>
                    <div className="leading-relaxed font-bold text-amber-900">
                        <p>
                            THIS PLATFORM IS PROVIDED "AS IS" AND IS COMPLETELY
                            OPEN AND FREE TO USE.
                        </p>
                        <p className="mt-2 text-lg">{platformNotice}</p>
                        <p className="mt-2">
                            WE DISCLAIM ALL WARRANTIES AND SHALL NOT BE HELD
                            LIABLE FOR ANY LOSSES, DISPUTES, OR DAMAGES ARISING
                            FROM THE USE OF THIS PLATFORM.
                        </p>
                    </div>
                </WarningNotice>

                <Section title="4. Fees">
                    <p>
                        Currently, there are no fees for listing or selling on
                        this platform. We may introduce premium features in the
                        future, but the core marketplace remains free to use.
                    </p>
                </Section>

                <Section title="5. Termination">
                    <p>
                        We may suspend or terminate your account at any time for
                        any reason, including violation of these terms or misuse
                        of the platform.
                    </p>
                </Section>
            </>
        ),
    };
}

function englishPrivacy(t: TranslationFunction): LegalDocument {
    const appName = t('common.app_name');
    const platformNotice = t('terms.platform_free_notice');

    return {
        title: t('privacy.title'),
        lastUpdated: 'May 31, 2026',
        content: (
            <>
                <Section title="1. Introduction">
                    <p>
                        This Privacy Policy explains how {appName} collects,
                        uses, discloses, and protects information when you use
                        our marketplace, website, and related services.
                    </p>
                    <p>
                        By using the platform, you agree to the collection and
                        use of information described in this policy.
                    </p>
                </Section>

                <Section title="2. Information We Collect">
                    <p>
                        We collect information you provide directly, including
                        your name, email address, profile details, listing
                        descriptions, item images, bids, purchase or sale
                        records, ratings, reports, and messages or support
                        requests.
                    </p>
                    <p>
                        If you sign in with Google or another third-party login
                        provider, we receive basic account information such as
                        your name, email address, profile image, and provider
                        account identifier, depending on that provider's
                        settings.
                    </p>
                    <p>
                        We also collect technical and usage information such as
                        IP address, device and browser details, log data, pages
                        viewed, actions taken, approximate location derived from
                        technical data, cookies, and similar identifiers.
                    </p>
                </Section>

                <Section title="3. How We Use Information">
                    <p>
                        We use information to operate the platform, create and
                        manage accounts, show listings, support bids and
                        marketplace interactions, enable user communication,
                        provide customer support, personalize and improve the
                        service, detect abuse or fraud, enforce our terms,
                        protect users, maintain security, and comply with legal
                        obligations.
                    </p>
                </Section>

                <Section title="4. Sharing of Information">
                    <p>
                        We do not sell your personal information. We may share
                        information with other users as needed for marketplace
                        features, such as public profile details, listing
                        content, ratings, bids, buyer or seller information, and
                        transaction-related details.
                    </p>
                    <p>
                        We may share information with service providers that
                        help us host the platform, store images, process
                        authentication, send communications, analyze usage,
                        prevent abuse, or provide other operational support. We
                        may also disclose information when required by law, to
                        protect rights and safety, to enforce our terms, or in
                        connection with a merger, acquisition, financing, or
                        transfer of assets.
                    </p>
                </Section>

                <Section title="5. Cookies and Similar Technologies">
                    <p>
                        We use cookies and similar technologies to keep you
                        signed in, remember preferences, secure the platform,
                        understand usage, and improve performance. You can
                        adjust cookie settings in your browser, but some
                        features may not work properly without cookies.
                    </p>
                </Section>

                <Section title="6. Retention">
                    <p>
                        We keep information for as long as needed to provide the
                        platform, maintain records, resolve disputes, enforce
                        agreements, prevent fraud or abuse, and comply with
                        legal obligations. We may retain certain information
                        after account closure when necessary for these purposes.
                    </p>
                </Section>

                <Section title="7. Security">
                    <p>
                        We use reasonable administrative, technical, and
                        organizational measures to protect information. However,
                        no internet service, storage system, or transmission
                        method is completely secure, and we cannot guarantee
                        absolute security.
                    </p>
                </Section>

                <Section title="8. Your Choices">
                    <p>
                        You may update certain account and profile information
                        through the platform. You may also request access,
                        correction, deletion, or other handling of your personal
                        information by contacting us through the support or
                        contact channel provided on the platform.
                    </p>
                    <p>
                        We may need to keep some information where required or
                        permitted by law, for legitimate business purposes, or
                        to protect the platform and its users.
                    </p>
                </Section>

                <Section title="9. Third-Party Services and Links">
                    <p>
                        The platform may link to or integrate with third-party
                        services, including authentication providers, storage
                        providers, maps, payment or delivery services, and
                        websites operated by other users or companies. Their
                        privacy practices are governed by their own policies.
                    </p>
                </Section>

                <Section title="10. International Use">
                    <p>
                        Your information may be processed and stored in
                        countries other than where you live. Those countries may
                        have data protection laws that differ from your local
                        laws.
                    </p>
                </Section>

                <Section title="11. Children's Privacy">
                    <p>
                        The platform is not intended for children. If you
                        believe a child has provided personal information to us,
                        please contact us so we can take appropriate action.
                    </p>
                </Section>

                <Section title="12. Platform Nature">
                    <InfoNotice>
                        <p>{platformNotice}</p>
                    </InfoNotice>
                </Section>

                <Section title="13. Changes to This Policy">
                    <p>
                        We may update this Privacy Policy from time to time. The
                        updated version will be posted on this page with a new
                        "Last updated" date. Your continued use of the platform
                        after changes become effective means you accept the
                        updated policy.
                    </p>
                </Section>

                <Section title="14. Contact">
                    <p>
                        If you have questions or requests about this Privacy
                        Policy or our handling of personal information, please
                        contact us through the support or contact channel
                        provided on the platform.
                    </p>
                </Section>
            </>
        ),
    };
}

function legacyPrivacy(t: TranslationFunction): LegalDocument {
    const platformNotice = t('terms.platform_free_notice');

    return {
        title: t('privacy.title'),
        lastUpdated: 'April 1, 2026',
        content: (
            <>
                <Section title="1. Data Collection">
                    <p>
                        We collect minimal personal data necessary to provide
                        our services, such as your name and email address when
                        you sign in via Google. We also collect item data,
                        images, and transaction records you voluntarily provide.
                    </p>
                </Section>

                <Section title="2. Use of Data">
                    <p>
                        Your data is used solely to facilitate the marketplace
                        experience, connect buyers and sellers, and improve our
                        services. We do not sell your personal information to
                        third parties.
                    </p>
                </Section>

                <Section title="3. Security">
                    <p>
                        We take reasonable measures to protect your information,
                        but please be aware that no method of transmission over
                        the internet is 100% secure.
                    </p>
                </Section>

                <Section title="4. Platform Nature">
                    <InfoNotice>
                        <p>{platformNotice}</p>
                    </InfoNotice>
                </Section>
            </>
        ),
    };
}
