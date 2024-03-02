import { cn } from '@/lib/utils';

export enum VerticalProgressTrackerStageStatus {
    Completed = 'completed',
    InProgress = 'inProgress',
    Upcoming = 'upcoming',
}

export enum VerticalProgressTrackerSortingType {
    LATEST_STAGE_IS_FIRST = 'latestStageIsFirst',
    LATEST_STAGE_IS_LAST = 'latestStageIsLast',
}

export type VerticalProgressTrackerStage = {
    id: string;
    status: VerticalProgressTrackerStageStatus;
    children: React.ReactNode;
};

type CircleShouldBeFilledOptions = {
    status: VerticalProgressTrackerStageStatus;
    sortingType: VerticalProgressTrackerSortingType;
    circlePosition: 'top' | 'bottom';
};

const getCircleStateClass = ({
    status,
    sortingType,
    circlePosition,
}: CircleShouldBeFilledOptions) => {
    if (sortingType === VerticalProgressTrackerSortingType.LATEST_STAGE_IS_LAST) {
        if (status === VerticalProgressTrackerStageStatus.Completed) {
            return 'bg-primary-v1 border-primary-v1';
        }

        if (
            circlePosition === 'top' &&
            status === VerticalProgressTrackerStageStatus.InProgress
        ) {
            return 'h-[18px] w-[18px] border-[4px] border-primary-v1-foreground bg-primary-v1';
        }

        return 'bg-primary-v1/30 border-primary-v1/30';
    }
};

const getLineStateClass = (status: VerticalProgressTrackerStageStatus) => {
    if (status === VerticalProgressTrackerStageStatus.Completed) {
        return 'border-primary-v1';
    }

    if (status === VerticalProgressTrackerStageStatus.InProgress) {
        return 'border-primary-v1 border-dashed';
    }

    return 'border-primary-v1/30 border-dashed';
};

type Props = {
    stages: VerticalProgressTrackerStage[];
    sortingType?: VerticalProgressTrackerSortingType;
};

export const VerticalProgressTracker = ({
    stages,
    sortingType = VerticalProgressTrackerSortingType.LATEST_STAGE_IS_LAST,
}: Props) => {
    return (
        <div>
            {stages.map((stage, index) => (
                <div key={stage.id} className="flex items-stretch space-x-4">
                    <div className="flex w-5 flex-col items-center">
                        <div
                            className={cn(
                                'h-2.5 w-2.5 rounded-full border',
                                getCircleStateClass({
                                    sortingType,
                                    status: stage.status,
                                    circlePosition: 'top',
                                }),
                            )}
                        />

                        <div
                            className={cn(
                                'w-[1px] flex-1 border-[1px]',
                                getLineStateClass(stage.status),
                            )}
                        />

                        {index === stages.length - 1 && (
                            <div
                                className={cn(
                                    'h-2.5 w-2.5 rounded-full border',
                                    getCircleStateClass({
                                        sortingType,
                                        status: stage.status,
                                        circlePosition: 'bottom',
                                    }),
                                )}
                            />
                        )}
                    </div>

                    <div className="min-w-0 flex-1 py-1.5">{stage.children}</div>
                </div>
            ))}
        </div>
    );
};
