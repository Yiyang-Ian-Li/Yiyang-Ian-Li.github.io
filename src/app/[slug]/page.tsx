import { notFound } from 'next/navigation';
import { getPageConfig, getMarkdownContent } from '@/lib/content';
import { getConfig } from '@/lib/config';
import { loadPublications } from '@/lib/publicationData';
import PublicationsList from '@/components/publications/PublicationsList';
import TextPage from '@/components/pages/TextPage';
import CardPage from '@/components/pages/CardPage';
import {
    BasePageConfig,
    PublicationPageConfig,
    TextPageConfig,
    CardPageConfig
} from '@/types/page';

import { Metadata } from 'next';

function getSiteUrl(url?: string) {
    return (url || 'https://yiyang-ian-li.github.io').replace(/\/+$/, '');
}

export function generateStaticParams() {
    const config = getConfig();
    return config.navigation
        .filter(nav => nav.type === 'page' && nav.target !== 'about') // 'about' is handled by root page
        .map(nav => ({
            slug: nav.target,
        }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
    const { slug } = await params;
    const pageConfig = getPageConfig(slug) as BasePageConfig | null;
    const siteConfig = getConfig();
    const siteUrl = getSiteUrl(siteConfig.site.url);

    if (!pageConfig) {
        return {};
    }

    return {
        metadataBase: new URL(siteUrl),
        title: pageConfig.title,
        description: pageConfig.description,
        alternates: {
            canonical: `/${slug}/`,
        },
        openGraph: {
            type: 'website',
            url: `${siteUrl}/${slug}/`,
            title: `${pageConfig.title} | ${siteConfig.author.name}`,
            description: pageConfig.description,
        },
    };
}

export default async function DynamicPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const pageConfig = getPageConfig(slug) as BasePageConfig | null;

    if (!pageConfig) {
        notFound();
    }

    return (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            {pageConfig.type === 'publication' && (
                <PublicationPage config={pageConfig as PublicationPageConfig} />
            )}
            {pageConfig.type === 'text' && (
                <TextPageWrapper config={pageConfig as TextPageConfig} />
            )}
            {pageConfig.type === 'card' && (
                <CardPage config={pageConfig as CardPageConfig} />
            )}
        </div>
    );
}

function PublicationPage({ config }: { config: PublicationPageConfig }) {
    const siteConfig = getConfig();
    const publications = loadPublications(config.source);
    return <PublicationsList config={config} publications={publications} viewAllHref={siteConfig.social.google_scholar} />;
}

function TextPageWrapper({ config }: { config: TextPageConfig }) {
    const content = getMarkdownContent(config.source);
    return <TextPage config={config} content={content} />;
}
