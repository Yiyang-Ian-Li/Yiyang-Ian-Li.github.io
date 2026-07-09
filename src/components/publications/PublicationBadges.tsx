'use client';

import { Publication } from '@/types/publication';
import { cn } from '@/lib/utils';

function normalizeArxivUrl(value?: string) {
    if (!value) return undefined;
    return value.startsWith('http') ? value : `https://arxiv.org/abs/${value}`;
}

const badgeStyles = {
    arxiv: 'border-red-200 bg-red-50 text-red-800 hover:border-red-300 hover:bg-red-100 dark:border-red-900/40 dark:bg-red-950/20 dark:text-red-300 dark:hover:bg-red-950/40',
    github: 'border-neutral-300 bg-neutral-50 text-neutral-800 hover:border-neutral-400 hover:bg-neutral-100 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-200 dark:hover:bg-neutral-800',
    huggingface: 'border-amber-200 bg-amber-50 text-amber-900 hover:border-amber-300 hover:bg-amber-100 dark:border-amber-700/50 dark:bg-amber-950/20 dark:text-amber-200 dark:hover:bg-amber-950/40',
};

interface BadgeLink {
    kind: keyof typeof badgeStyles;
    label: string;
    href?: string;
    mark?: React.ReactNode;
}

export default function PublicationBadges({ pub, className }: { pub: Publication; className?: string }) {
    const links: BadgeLink[] = [
        {
            kind: 'arxiv',
            label: 'arXiv',
            href: normalizeArxivUrl(pub.arxiv || pub.arxivId),
            mark: <i className="ai ai-arxiv text-[0.95rem] leading-none" aria-hidden="true" />,
        },
        {
            kind: 'github',
            label: 'GitHub',
            href: pub.github || pub.code,
            mark: <i className="fa-brands fa-github text-[0.95rem] leading-none" aria-hidden="true" />,
        },
        {
            kind: 'huggingface',
            label: 'Hugging Face',
            href: pub.huggingface,
            mark: <i className="fa-brands fa-hugging-face text-[0.95rem] leading-none" aria-hidden="true" />,
        },
    ];

    const availableLinks = links.filter((link): link is BadgeLink & { href: string } => Boolean(link.href));

    if (availableLinks.length === 0) return null;

    return (
        <div className={cn('flex flex-wrap gap-2', className)}>
            {availableLinks.map((link) => (
                <a
                    key={link.label}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={cn(
                        'inline-flex h-7 items-center gap-1.5 rounded-md border px-2.5 text-xs font-medium transition-colors',
                        badgeStyles[link.kind]
                    )}
                >
                    {link.mark && (
                        <span className="inline-flex h-4 min-w-4 items-center justify-center text-current">
                            {link.mark}
                        </span>
                    )}
                    {link.label}
                </a>
            ))}
        </div>
    );
}
