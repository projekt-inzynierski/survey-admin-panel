import { Observable } from "rxjs";
import { CreateSurveyDto } from "../models/create.survey.dto";
import { SurveyDto } from "../models/survey.dto";

export interface SurveyService{
    //TO DO: this is of type any just temporary, has to be changed
    createSurvey(dto: CreateSurveyDto): Observable<any>;
    getAllShort(): Observable<SurveyDto[]>;
}