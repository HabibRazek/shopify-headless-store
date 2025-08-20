'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface ActivityData {
    label: string;
    value: number;
    color: string;
    size: number;
    current: number;
    target: number;
    unit: string;
}

interface CircleProgressProps {
    data: ActivityData;
    index: number;
}

interface KPIData {
  totalUsers: number;
  totalPosts: number;
  totalMessages: number;
  publishedPosts: number;
  activeUsers: number;
}

const CircleProgress = ({ data, index }: CircleProgressProps) => {
    const strokeWidth = 16;
    const radius = (data.size - strokeWidth) / 2;
    const circumference = radius * 2 * Math.PI;
    const progress = ((100 - data.value) / 100) * circumference;

    const gradientId = `gradient-${data.label.toLowerCase().replace(/\s+/g, '-')}`;
    const gradientUrl = `url(#${gradientId})`;

    return (
        <motion.div
            className="absolute inset-0 flex items-center justify-center"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: index * 0.2, ease: "easeOut" }}
        >
            <div className="relative">
                <svg
                    width={data.size}
                    height={data.size}
                    viewBox={`0 0 ${data.size} ${data.size}`}
                    className="transform -rotate-90"
                    aria-label={`${data.label} Progress - ${data.value}%`}
                >
                    <title>{`${data.label} Progress - ${data.value}%`}</title>

                    <defs>
                        <linearGradient
                            id={gradientId}
                            x1="0%"
                            y1="0%"
                            x2="100%"
                            y2="100%"
                        >
                            <stop
                                offset="0%"
                                style={{
                                    stopColor: data.color,
                                    stopOpacity: 1,
                                }}
                            />
                            <stop
                                offset="100%"
                                style={{
                                    stopColor:
                                        data.color === "#22c55e"
                                            ? "#16a34a"
                                            : data.color === "#3b82f6"
                                            ? "#1d4ed8"
                                            : "#7c3aed",
                                    stopOpacity: 1,
                                }}
                            />
                        </linearGradient>
                    </defs>

                    <circle
                        cx={data.size / 2}
                        cy={data.size / 2}
                        r={radius}
                        fill="none"
                        stroke="currentColor"
                        strokeWidth={strokeWidth}
                        className="text-gray-200 dark:text-gray-700"
                    />

                    <motion.circle
                        cx={data.size / 2}
                        cy={data.size / 2}
                        r={radius}
                        fill="none"
                        stroke={gradientUrl}
                        strokeWidth={strokeWidth}
                        strokeDasharray={circumference}
                        initial={{ strokeDashoffset: circumference }}
                        animate={{ strokeDashoffset: progress }}
                        transition={{
                            duration: 1.8,
                            delay: index * 0.2,
                            ease: "easeInOut",
                        }}
                        strokeLinecap="round"
                        style={{
                            filter: "drop-shadow(0 0 6px rgba(0,0,0,0.15))",
                        }}
                    />
                </svg>
            </div>
        </motion.div>
    );
};

const DetailedActivityInfo = ({ activities }: { activities: ActivityData[] }) => {
    return (
        <motion.div
            className="flex flex-col gap-6 ml-8"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
        >
            {activities.map((activity) => (
                <motion.div key={activity.label} className="flex flex-col">
                    <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                        {activity.label}
                    </span>
                    <span
                        className="text-2xl font-semibold"
                        style={{ color: activity.color }}
                    >
                        {activity.current}/{activity.target}
                        <span className="text-base ml-1 text-gray-600 dark:text-gray-400">
                            {activity.unit}
                        </span>
                    </span>
                    <span className="text-xs text-gray-500 dark:text-gray-500">
                        {activity.value.toFixed(1)}% complete
                    </span>
                </motion.div>
            ))}
        </motion.div>
    );
};

export default function ActivityRingsChart({
    title = "Site Performance",
    className,
}: {
    title?: string;
    className?: string;
}) {
    const [activities, setActivities] = useState<ActivityData[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchKPIData();
    }, []);

    const fetchKPIData = async () => {
        try {
            setLoading(true);
            
            // Fetch users data
            const usersResponse = await fetch('/api/admin/users?limit=1000');
            const usersData = await usersResponse.json();
            const users = usersData.users || [];

            // Fetch blog posts data
            const postsResponse = await fetch('/api/admin/blog/posts');
            const postsData = await postsResponse.json();
            const posts = postsData.posts || [];

            // Fetch messages data (if available)
            let messages = [];
            try {
                const messagesResponse = await fetch('/api/admin/messages');
                if (messagesResponse.ok) {
                    const messagesData = await messagesResponse.json();
                    messages = messagesData.messages || [];
                }
            } catch (error) {
                console.log('Messages API not available');
            }

            const kpiData: KPIData = {
                totalUsers: users.length,
                totalPosts: posts.length,
                totalMessages: messages.length,
                publishedPosts: posts.filter((post: any) => post.published).length,
                activeUsers: users.filter((user: any) => user.status === 'active').length,
            };

            // Create activity rings based on real data
            const newActivities: ActivityData[] = [
                {
                    label: "USERS",
                    value: Math.min((kpiData.totalUsers / 1000) * 100, 100), // Target: 1000 users
                    color: "#22c55e", // Green
                    size: 200,
                    current: kpiData.totalUsers,
                    target: 1000,
                    unit: "USERS",
                },
                {
                    label: "CONTENT",
                    value: Math.min((kpiData.publishedPosts / 100) * 100, 100), // Target: 100 posts
                    color: "#3b82f6", // Blue
                    size: 160,
                    current: kpiData.publishedPosts,
                    target: 100,
                    unit: "POSTS",
                },
                {
                    label: "ENGAGEMENT",
                    value: Math.min((kpiData.totalMessages / 500) * 100, 100), // Target: 500 messages
                    color: "#8b5cf6", // Purple
                    size: 120,
                    current: kpiData.totalMessages,
                    target: 500,
                    unit: "MSGS",
                },
            ];

            setActivities(newActivities);
        } catch (error) {
            console.error('Error fetching KPI data:', error);
            // Set default values if API fails
            setActivities([
                {
                    label: "USERS",
                    value: 0,
                    color: "#22c55e",
                    size: 200,
                    current: 0,
                    target: 1000,
                    unit: "USERS",
                },
                {
                    label: "CONTENT",
                    value: 0,
                    color: "#3b82f6",
                    size: 160,
                    current: 0,
                    target: 100,
                    unit: "POSTS",
                },
                {
                    label: "ENGAGEMENT",
                    value: 0,
                    color: "#8b5cf6",
                    size: 120,
                    current: 0,
                    target: 500,
                    unit: "MSGS",
                },
            ]);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className={cn(
                "relative w-full max-w-3xl mx-auto p-8 rounded-3xl bg-white dark:bg-gray-800 shadow-lg",
                className
            )}>
                <div className="flex flex-col items-center gap-8">
                    <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-48 animate-pulse"></div>
                    <div className="flex items-center">
                        <div className="relative w-[200px] h-[200px] bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse"></div>
                        <div className="flex flex-col gap-6 ml-8">
                            {[1, 2, 3].map((i) => (
                                <div key={i} className="flex flex-col gap-2">
                                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-16 animate-pulse"></div>
                                    <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-24 animate-pulse"></div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div
            className={cn(
                "relative w-full max-w-3xl mx-auto p-8 rounded-3xl bg-white dark:bg-gray-800 shadow-lg",
                "text-gray-900 dark:text-white",
                className
            )}
        >
            <div className="flex flex-col items-center gap-8">
                <motion.h2
                    className="text-2xl font-medium text-gray-900 dark:text-white"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    {title}
                </motion.h2>

                <div className="flex items-center">
                    <div className="relative w-[200px] h-[200px]">
                        {activities.map((activity, index) => (
                            <CircleProgress
                                key={activity.label}
                                data={activity}
                                index={index}
                            />
                        ))}
                    </div>
                    <DetailedActivityInfo activities={activities} />
                </div>
            </div>
        </div>
    );
}
