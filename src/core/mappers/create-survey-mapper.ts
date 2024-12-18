import { CreateOptionDto } from "../../domain/models/create.option.dto";
import { CreateQuestionDto } from "../../domain/models/create.question.dto";
import { CreateSurveyDto } from "../../domain/models/create.survey.dto";
import { CreateSurveySectionDto } from "../../domain/models/create.survey.section.dto";
import { NumberRangeDto } from "../../domain/models/number.range.dto";
import { QuestionType } from "../../domain/models/question-type";
import { CreateQuestionModel } from "../models/create.question.model";
import { CreateSectionModel } from "../models/create.section.model";
import { CreateSurveyModel } from "../models/create.survey.model";
import { ImageOption } from "../models/image_option";
import { NumberRangeModel } from "../models/number.range.model";
import { TextSelectionOption } from "../models/text.selection.option";
import { Mapper } from "./mapper";

export class CreateSurveyMapper implements Mapper<CreateSurveyModel, CreateSurveyDto>{
    map(source: CreateSurveyModel): CreateSurveyDto {
        const survey: CreateSurveyDto = {
            name: source.name!,
            sections: []
        };

        source.sections.forEach((section, index) => {
            survey.sections.push(this.mapSection(section, index));
        });

        return survey;
    }
    
    private mapSection(source: CreateSectionModel, index: number): CreateSurveySectionDto {
        const section: CreateSurveySectionDto ={
            order: index + 1,
            name: source.name!,
            visibility: source.visibility,
            groupId: source.respondentsGroupId,
            questions: [],
            displayOnOneScreen: source.displayOnOneScreen
        };

        source.questions.forEach((question, index) => {
            section.questions.push(this.mapQuestion(question, index));
        }); 

        return section;
   }

   private mapQuestion(source: CreateQuestionModel, index: number): CreateQuestionDto {
        const question: CreateQuestionDto ={
            order: index + 1,
            content: source.content!,
            questionType: source.type,
            required: source.isRequired,
        };

        if (source.type == QuestionType.SINGLE_CHOICE
            || source.type == QuestionType.MULTIPLE_CHOICE
        ){
            question.options = [];
            source.options.forEach((option, index) => {
                question.options!.push(this.mapOption(option, index));
            });
        }

        if (source.type == QuestionType.LINEAR_SCALE){
            question.numberRange = this.mapNumberRange(source.numberRange);
        }
        
        if (source.type == QuestionType.IMAGE_CHOICE){
            question.options = [];
            source.imageOptions.forEach((option, index) => {
                question.options!.push(this.mapImageOption(option, index));
            });
        }

        return question;
    }

    private mapImageOption(source: ImageOption, index: number): CreateOptionDto {
        return {
            order: index + 1,
            label: source.code!,
        }
    }

    private mapOption(source: TextSelectionOption, index: number): CreateOptionDto {
        return {
            order: index + 1,
            label: source.content,
            showSection: source.showSection
        }
    }

    private mapNumberRange(source: NumberRangeModel): NumberRangeDto{
        return {
            from: source.from,
            to: source.to,
            fromLabel: source.fromLabel,
            toLabel: source.toLabel
        }
    }
}