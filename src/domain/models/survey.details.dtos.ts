import { QuestionType } from "./question-type"
import { SectionVisibility } from "./section.visibility"

export interface SurveyDetailsDto {
    id: string,
    name: string,
    state: SurveyState,
    rowVersion: number,
    sections: SurveySectionDto[]
}

export interface SurveySectionDto{
    id: string,
    order: number,
    name: string,
    visibility: SectionVisibility,
    groupId?: string,
    rowVersion: number,
    questions: SurveyQuestionDto[]
    displayOnOneScreen: boolean
}

export interface SurveyQuestionDto{
    id: string,
    order: number,
    content: string,
    questionType: QuestionType,
    required: boolean,
    rowVersion: number,
    options?: SurveyOptionDto[],
    numberRange?: SurveyNumberRangeDto
}

export interface SurveyOptionDto{
    id: string,
    order: number,
    label: string,
    showSection?: number,
    rowVersion: number
    imagePath?: string
}

export interface SurveyNumberRangeDto{
    id: string,
    from: number,
    to: number,
    fromLabel: string,
    toLabel: string,
    rowVersion: number
}

export type SurveyState = 'craeted' | 'published'; 