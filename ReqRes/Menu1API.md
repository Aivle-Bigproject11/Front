# Menu1API.md

## JSON server 실행 명령어
npm run server

## 부고장 전체 조회

▼▼▼ Request 샘플 (POSTMAN)
GET http://localhost:8080/obituaries
---
None



▲▲▲ Response 샘플 (POSTMAN)
---

{
    "_embedded": {
        "obituaries": [
            {
                "funeralInfoId": 1,
                "obituaryTemplateId": null,
                "obituaryFileName": "obituaries/obituary_1.png",
                "obituaryFileUrl": "https://a071098blobtest.blob.core.windows.net/a071098container/obituaries/obituary_1.png",
                "obituaryStatus": "COMPLETED",
                "obituaryCreatedAt": "2025-08-08T07:01:23.890+00:00",
                "customerId": 1,
                "deceasedName": "김철수",
                "deceasedNameHanja": "金哲洙",
                "deceasedRrn": "430510-1000111",
                "deceasedAge": 82,
                "deceasedBirthOfDate": "1943-05-10T00:00:00.000+00:00",
                "deceasedGender": "남성",
                "deceasedDate": "2025-08-01T14:00:00.000+00:00",
                "deceasedReligion": "불교",
                "deceasedRegisteredAddress": "충청북도 청주시 상당구 문의면",
                "deceasedAddress": "서울특별시 종로구 세종대로 175",
                "deceasedRelationToHouseholdHead": "본인",
                "reportRegistrationDate": "2025-08-01T00:00:00.000+00:00",
                "deathLocation": "서울대학교병원",
                "deathLocationType": "2",
                "deathLocationEtc": null,
                "deathReportEtc": "지병으로 인한 사망",
                "reporterName": "이영희",
                "reporterRrn": "450815-2000222",
                "reporterQualification": "1",
                "reporterRelationToDeceased": "배우자",
                "reporterAddress": "서울특별시 종로구 세종대로 175",
                "reporterPhone": "010-3333-4444",
                "reporterEmail": "younghee.lee@example.com",
                "submitterName": "이영희",
                "submitterRrn": "450815-2000222",
                "funeralCompanyName": "GoldenGate",
                "directorName": "이장례",
                "directorPhone": "010-9876-5432",
                "funeralHomeName": "서울대학교병원 장례식장",
                "funeralHomeAddress": "서울특별시 종로구 대학로 101",
                "funeralHomeAddressUrl": null,
                "funeralDuration": "3일장",
                "mortuaryInfo": "특실 1호",
                "processionDateTime": "2025-08-03T07:00:00Z",
                "burialSiteInfo": "서울시립승화원",
                "chiefMourners": "배우자 이영희, 아들 김상주, 딸 김상미",
                "chiefMournersContact": "010-5555-6666 (아들 김상주)",
                "chiefMournerAccountHolder": "김상주",
                "chiefMournerBankName": "신한은행",
                "chiefMournerAccountNumber": "110-123-456789",
                "templateKeyword": "고요함",
                "_links": {
                    "self": {
                        "href": "http://funeralcontext:8080/obituaries/1"
                    },
                    "obituary": {
                        "href": "http://funeralcontext:8080/obituaries/1"
                    }
                }
            }
        ]
    },
    "_links": {
        "self": {
            "href": "http://funeralcontext:8080/obituaries"
        },
        "profile": {
            "href": "http://funeralcontext:8080/profile/obituaries"
        }
    },
    "page": {
        "size": 20,
        "totalElements": 1,
        "totalPages": 1,
        "number": 0
    }
}


---


## 부고장 조회

▼▼▼ Request 샘플 (POSTMAN)
GET
http://localhost:8080/obituaries/search/findFirstByCustomerIdOrderByObituaryIdDesc?customerId=1
---
None



동일한 정보로 2개 이상의 문서를 만든 상태에서
customerId로 검색했을 때 Id(PK)가 가장 높은값 1개만 반환

▲▲▲ Response 샘플 (POSTMAN)
{
    "funeralInfoId": 1,
    "obituaryTemplateId": null,
    "obituaryFileName": "obituaries/obituary_2.png",
    "obituaryFileUrl": "https://a071098blobtest.blob.core.windows.net/a071098container/obituaries/obituary_2.png",
    "obituaryStatus": "COMPLETED",
    "obituaryCreatedAt": "2025-08-08T12:55:14.368+00:00",
    "customerId": 1,
    "deceasedName": "김철수",
    "deceasedNameHanja": "金哲洙",
    "deceasedRrn": "430510-1000111",
    "deceasedAge": 82,
    "deceasedBirthOfDate": "1943-05-10T00:00:00.000+00:00",
    "deceasedGender": "남성",
    "deceasedDate": "2025-08-01T14:00:00.000+00:00",
    "deceasedReligion": "불교",
    "deceasedRegisteredAddress": "충청북도 청주시 상당구 문의면",
    "deceasedAddress": "서울특별시 종로구 세종대로 175",
    "deceasedRelationToHouseholdHead": "본인",
    "reportRegistrationDate": "2025-08-01T00:00:00.000+00:00",
    "deathLocation": "서울대학교병원",
    "deathLocationType": "2",
    "deathLocationEtc": null,
    "deathReportEtc": "지병으로 인한 사망",
    "reporterName": "이영희",
    "reporterRrn": "450815-2000222",
    "reporterQualification": "1",
    "reporterRelationToDeceased": "배우자",
    "reporterAddress": "서울특별시 종로구 세종대로 175",
    "reporterPhone": "010-3333-4444",
    "reporterEmail": "younghee.lee@example.com",
    "submitterName": "이영희",
    "submitterRrn": "450815-2000222",
    "funeralCompanyName": "GoldenGate",
    "directorName": "이장례",
    "directorPhone": "010-9876-5432",
    "funeralHomeName": "서울대학교병원 장례식장",
    "funeralHomeAddress": "서울특별시 종로구 대학로 101",
    "funeralHomeAddressUrl": null,
    "funeralDuration": "3일장",
    "mortuaryInfo": "특실 1호",
    "processionDateTime": "2025-08-03T07:00:00Z",
    "burialSiteInfo": "서울시립승화원",
    "chiefMourners": "배우자 이영희, 아들 김상주, 딸 김상미",
    "chiefMournersContact": "010-5555-6666 (아들 김상주)",
    "chiefMournerAccountHolder": "김상주",
    "chiefMournerBankName": "신한은행",
    "chiefMournerAccountNumber": "110-123-456789",
    "templateKeyword": "고요함",
    "_links": {
        "self": {
            "href": "http://funeralcontext:8080/obituaries/2"
        },
        "obituary": {
            "href": "http://funeralcontext:8080/obituaries/2"
        }
    }
}


---


## 사망신고서 전체 조회

▼▼▼ Request 샘플 (POSTMAN)
GET
http://localhost:8080/deathReports
---
None


▲▲▲ Response 샘플 (POSTMAN)

{
    "_embedded": {
        "deathReports": [
            {
                "funeralInfoId": 1,
                "deathReportTemplateId": null,
                "deathReportFileName": "death-reports/death_report_1.pdf",
                "deathReportFileUrl": "https://a071098blobtest.blob.core.windows.net/a071098container/death-reports/death_report_1.pdf",
                "deathReportStatus": "COMPLETED",
                "deathReportCreatedAt": "2025-08-09T00:19:40.930+00:00",
                "customerId": 1,
                "deceasedName": "김철수",
                "deceasedNameHanja": "金哲洙",
                "deceasedRrn": "430510-1000111",
                "deceasedAge": 82,
                "deceasedBirthOfDate": "1943-05-10T00:00:00.000+00:00",
                "deceasedGender": "남성",
                "deceasedDate": "2025-08-01T14:00:00.000+00:00",
                "deceasedReligion": "불교",
                "deceasedRegisteredAddress": "충청북도 청주시 상당구 문의면",
                "deceasedAddress": "서울특별시 종로구 세종대로 175",
                "deceasedRelationToHouseholdHead": "본인",
                "reportRegistrationDate": "2025-08-01T00:00:00.000+00:00",
                "deathLocation": "서울대학교병원",
                "deathLocationType": "2",
                "deathLocationEtc": null,
                "deathReportEtc": "지병으로 인한 사망",
                "reporterName": "이영희",
                "reporterRrn": "450815-2000222",
                "reporterQualification": "1",
                "reporterRelationToDeceased": "배우자",
                "reporterAddress": "서울특별시 종로구 세종대로 175",
                "reporterPhone": "010-3333-4444",
                "reporterEmail": "younghee.lee@example.com",
                "submitterName": "이영희",
                "submitterRrn": "450815-2000222",
                "funeralCompanyName": "GoldenGate",
                "directorName": "이장례",
                "directorPhone": "010-9876-5432",
                "funeralHomeName": "서울대학교병원 장례식장",
                "funeralHomeAddress": "서울특별시 종로구 대학로 101",
                "funeralHomeAddressUrl": null,
                "funeralDuration": "3일장",
                "mortuaryInfo": "특실 1호",
                "processionDateTime": "2025-08-03T07:00:00Z",
                "burialSiteInfo": "서울시립승화원",
                "chiefMourners": "배우자 이영희, 아들 김상주, 딸 김상미",
                "chiefMournersContact": "010-5555-6666 (아들 김상주)",
                "chiefMournerAccountHolder": "김상주",
                "chiefMournerBankName": "신한은행",
                "chiefMournerAccountNumber": "110-123-456789",
                "templateKeyword": "고요함",
                "_links": {
                    "self": {
                        "href": "http://funeralcontext:8080/deathReports/1"
                    },
                    "deathReport": {
                        "href": "http://funeralcontext:8080/deathReports/1"
                    }
                }
            },
            {
                "funeralInfoId": 1,
                "deathReportTemplateId": null,
                "deathReportFileName": "death-reports/death_report_2.pdf",
                "deathReportFileUrl": "https://a071098blobtest.blob.core.windows.net/a071098container/death-reports/death_report_2.pdf",
                "deathReportStatus": "COMPLETED",
                "deathReportCreatedAt": "2025-08-09T00:19:52.465+00:00",
                "customerId": 1,
                "deceasedName": "김철수",
                "deceasedNameHanja": "金哲洙",
                "deceasedRrn": "430510-1000111",
                "deceasedAge": 82,
                "deceasedBirthOfDate": "1943-05-10T00:00:00.000+00:00",
                "deceasedGender": "남성",
                "deceasedDate": "2025-08-01T14:00:00.000+00:00",
                "deceasedReligion": "불교",
                "deceasedRegisteredAddress": "충청북도 청주시 상당구 문의면",
                "deceasedAddress": "서울특별시 종로구 세종대로 175",
                "deceasedRelationToHouseholdHead": "본인",
                "reportRegistrationDate": "2025-08-01T00:00:00.000+00:00",
                "deathLocation": "서울대학교병원",
                "deathLocationType": "2",
                "deathLocationEtc": null,
                "deathReportEtc": "지병으로 인한 사망",
                "reporterName": "이영희",
                "reporterRrn": "450815-2000222",
                "reporterQualification": "1",
                "reporterRelationToDeceased": "배우자",
                "reporterAddress": "서울특별시 종로구 세종대로 175",
                "reporterPhone": "010-3333-4444",
                "reporterEmail": "younghee.lee@example.com",
                "submitterName": "이영희",
                "submitterRrn": "450815-2000222",
                "funeralCompanyName": "GoldenGate",
                "directorName": "이장례",
                "directorPhone": "010-9876-5432",
                "funeralHomeName": "서울대학교병원 장례식장",
                "funeralHomeAddress": "서울특별시 종로구 대학로 101",
                "funeralHomeAddressUrl": null,
                "funeralDuration": "3일장",
                "mortuaryInfo": "특실 1호",
                "processionDateTime": "2025-08-03T07:00:00Z",
                "burialSiteInfo": "서울시립승화원",
                "chiefMourners": "배우자 이영희, 아들 김상주, 딸 김상미",
                "chiefMournersContact": "010-5555-6666 (아들 김상주)",
                "chiefMournerAccountHolder": "김상주",
                "chiefMournerBankName": "신한은행",
                "chiefMournerAccountNumber": "110-123-456789",
                "templateKeyword": "고요함",
                "_links": {
                    "self": {
                        "href": "http://funeralcontext:8080/deathReports/2"
                    },
                    "deathReport": {
                        "href": "http://funeralcontext:8080/deathReports/2"
                    }
                }
            }
        ]
    },
    "_links": {
        "self": {
            "href": "http://funeralcontext:8080/deathReports"
        },
        "profile": {
            "href": "http://funeralcontext:8080/profile/deathReports"
        },
        "search": {
            "href": "http://funeralcontext:8080/deathReports/search"
        }
    },
    "page": {
        "size": 20,
        "totalElements": 2,
        "totalPages": 1,
        "number": 0
    }
}


---


## 사망신고서 조회

▼▼▼ Request 샘플 (POSTMAN)
GET
http://localhost:8080/deathReports/search/findFirstByCustomerIdOrderByDeathReportIdDesc?customerId=1
---
None




동일한 정보로 2개 이상의 문서를 만든 상태에서
customerId로 검색했을 때 Id(PK)가 가장 높은값 1개만 반환

▲▲▲ Response 샘플 (POSTMAN)

{
    "funeralInfoId": 1,
    "deathReportTemplateId": null,
    "deathReportFileName": "death-reports/death_report_2.pdf",
    "deathReportFileUrl": "https://a071098blobtest.blob.core.windows.net/a071098container/death-reports/death_report_2.pdf",
    "deathReportStatus": "COMPLETED",
    "deathReportCreatedAt": "2025-08-09T00:19:52.465+00:00",
    "customerId": 1,
    "deceasedName": "김철수",
    "deceasedNameHanja": "金哲洙",
    "deceasedRrn": "430510-1000111",
    "deceasedAge": 82,
    "deceasedBirthOfDate": "1943-05-10T00:00:00.000+00:00",
    "deceasedGender": "남성",
    "deceasedDate": "2025-08-01T14:00:00.000+00:00",
    "deceasedReligion": "불교",
    "deceasedRegisteredAddress": "충청북도 청주시 상당구 문의면",
    "deceasedAddress": "서울특별시 종로구 세종대로 175",
    "deceasedRelationToHouseholdHead": "본인",
    "reportRegistrationDate": "2025-08-01T00:00:00.000+00:00",
    "deathLocation": "서울대학교병원",
    "deathLocationType": "2",
    "deathLocationEtc": null,
    "deathReportEtc": "지병으로 인한 사망",
    "reporterName": "이영희",
    "reporterRrn": "450815-2000222",
    "reporterQualification": "1",
    "reporterRelationToDeceased": "배우자",
    "reporterAddress": "서울특별시 종로구 세종대로 175",
    "reporterPhone": "010-3333-4444",
    "reporterEmail": "younghee.lee@example.com",
    "submitterName": "이영희",
    "submitterRrn": "450815-2000222",
    "funeralCompanyName": "GoldenGate",
    "directorName": "이장례",
    "directorPhone": "010-9876-5432",
    "funeralHomeName": "서울대학교병원 장례식장",
    "funeralHomeAddress": "서울특별시 종로구 대학로 101",
    "funeralHomeAddressUrl": null,
    "funeralDuration": "3일장",
    "mortuaryInfo": "특실 1호",
    "processionDateTime": "2025-08-03T07:00:00Z",
    "burialSiteInfo": "서울시립승화원",
    "chiefMourners": "배우자 이영희, 아들 김상주, 딸 김상미",
    "chiefMournersContact": "010-5555-6666 (아들 김상주)",
    "chiefMournerAccountHolder": "김상주",
    "chiefMournerBankName": "신한은행",
    "chiefMournerAccountNumber": "110-123-456789",
    "templateKeyword": "고요함",
    "_links": {
        "self": {
            "href": "http://funeralcontext:8080/deathReports/2"
        },
        "deathReport": {
            "href": "http://funeralcontext:8080/deathReports/2"
        }
    }
}


---


## 장례일정표 전체 조회

▼▼▼ Request 샘플 (POSTMAN)
GET
http://localhost:8080/schedules
---
None

▲▲▲ Response 샘플 (POSTMAN)

{
    "_embedded": {
        "schedules": [
            {
                "funeralInfoId": 1,
                "scheduleTemplateId": null,
                "scheduleDallePrompt": "연한 수채화 느낌의 장례식 일정표 배경 이미지를 그려줘. 이미지는 세로형이며, 배경은 따뜻한 색상이고 중앙에는 넓은 여백이 있어야 해. 전체적인 분위기는 '불교' 종교와 '고요함' 키워드에 어울리도록 차분하고 정중하게 표현해줘. 불필요한 장식은 배제하고, 텍스트가 잘 읽힐 수 있도록 미니멀한 구성이면 좋겠어.텍스트, 문장, 알파벳, 글자는 절대로 포함하지 마세요. 오직 배경 그래픽만 포함된 미니멀한 이미지여야 합니다.",
                "scheduleDalleTemplateImageUrl": "https://a071098blobtest.blob.core.windows.net/a071098container/schedule-templates/template_1.png",
                "scheduleFileName": "schedules/schedule_1.png",
                "scheduleFileUrl": "https://a071098blobtest.blob.core.windows.net/a071098container/schedules/schedule_1.png",
                "scheduleStatus": "COMPLETED",
                "scheduleCreatedAt": "2025-08-09T00:22:27.569+00:00",
                "customerId": 1,
                "deceasedName": "김철수",
                "deceasedNameHanja": "金哲洙",
                "deceasedRrn": "430510-1000111",
                "deceasedAge": 82,
                "deceasedBirthOfDate": "1943-05-10T00:00:00.000+00:00",
                "deceasedGender": "남성",
                "deceasedDate": "2025-08-01T14:00:00.000+00:00",
                "deceasedReligion": "불교",
                "deceasedRegisteredAddress": "충청북도 청주시 상당구 문의면",
                "deceasedAddress": "서울특별시 종로구 세종대로 175",
                "deceasedRelationToHouseholdHead": "본인",
                "reportRegistrationDate": "2025-08-01T00:00:00.000+00:00",
                "deathLocation": "서울대학교병원",
                "deathLocationType": "2",
                "deathLocationEtc": null,
                "deathReportEtc": "지병으로 인한 사망",
                "reporterName": "이영희",
                "reporterRrn": "450815-2000222",
                "reporterQualification": "1",
                "reporterRelationToDeceased": "배우자",
                "reporterAddress": "서울특별시 종로구 세종대로 175",
                "reporterPhone": "010-3333-4444",
                "reporterEmail": "younghee.lee@example.com",
                "submitterName": "이영희",
                "submitterRrn": "450815-2000222",
                "funeralCompanyName": "GoldenGate",
                "directorName": "이장례",
                "directorPhone": "010-9876-5432",
                "funeralHomeName": "서울대학교병원 장례식장",
                "funeralHomeAddress": "서울특별시 종로구 대학로 101",
                "funeralHomeAddressUrl": null,
                "funeralDuration": "3일장",
                "mortuaryInfo": "특실 1호",
                "processionDateTime": "2025-08-03T07:00:00Z",
                "burialSiteInfo": "서울시립승화원",
                "chiefMourners": "배우자 이영희, 아들 김상주, 딸 김상미",
                "chiefMournersContact": "010-5555-6666 (아들 김상주)",
                "chiefMournerAccountHolder": "김상주",
                "chiefMournerBankName": "신한은행",
                "chiefMournerAccountNumber": "110-123-456789",
                "templateKeyword": "고요함",
                "_links": {
                    "self": {
                        "href": "http://funeralcontext:8080/schedules/1"
                    },
                    "schedule": {
                        "href": "http://funeralcontext:8080/schedules/1"
                    }
                }
            },
            {
                "funeralInfoId": 1,
                "scheduleTemplateId": null,
                "scheduleDallePrompt": "연한 수채화 느낌의 장례식 일정표 배경 이미지를 그려줘. 이미지는 세로형이며, 배경은 따뜻한 색상이고 중앙에는 넓은 여백이 있어야 해. 전체적인 분위기는 '불교' 종교와 '고요함' 키워드에 어울리도록 차분하고 정중하게 표현해줘. 불필요한 장식은 배제하고, 텍스트가 잘 읽힐 수 있도록 미니멀한 구성이면 좋겠어.텍스트, 문장, 알파벳, 글자는 절대로 포함하지 마세요. 오직 배경 그래픽만 포함된 미니멀한 이미지여야 합니다.",
                "scheduleDalleTemplateImageUrl": "https://a071098blobtest.blob.core.windows.net/a071098container/schedule-templates/template_2.png",
                "scheduleFileName": "schedules/schedule_2.png",
                "scheduleFileUrl": "https://a071098blobtest.blob.core.windows.net/a071098container/schedules/schedule_2.png",
                "scheduleStatus": "COMPLETED",
                "scheduleCreatedAt": "2025-08-09T00:22:58.793+00:00",
                "customerId": 1,
                "deceasedName": "김철수",
                "deceasedNameHanja": "金哲洙",
                "deceasedRrn": "430510-1000111",
                "deceasedAge": 82,
                "deceasedBirthOfDate": "1943-05-10T00:00:00.000+00:00",
                "deceasedGender": "남성",
                "deceasedDate": "2025-08-01T14:00:00.000+00:00",
                "deceasedReligion": "불교",
                "deceasedRegisteredAddress": "충청북도 청주시 상당구 문의면",
                "deceasedAddress": "서울특별시 종로구 세종대로 175",
                "deceasedRelationToHouseholdHead": "본인",
                "reportRegistrationDate": "2025-08-01T00:00:00.000+00:00",
                "deathLocation": "서울대학교병원",
                "deathLocationType": "2",
                "deathLocationEtc": null,
                "deathReportEtc": "지병으로 인한 사망",
                "reporterName": "이영희",
                "reporterRrn": "450815-2000222",
                "reporterQualification": "1",
                "reporterRelationToDeceased": "배우자",
                "reporterAddress": "서울특별시 종로구 세종대로 175",
                "reporterPhone": "010-3333-4444",
                "reporterEmail": "younghee.lee@example.com",
                "submitterName": "이영희",
                "submitterRrn": "450815-2000222",
                "funeralCompanyName": "GoldenGate",
                "directorName": "이장례",
                "directorPhone": "010-9876-5432",
                "funeralHomeName": "서울대학교병원 장례식장",
                "funeralHomeAddress": "서울특별시 종로구 대학로 101",
                "funeralHomeAddressUrl": null,
                "funeralDuration": "3일장",
                "mortuaryInfo": "특실 1호",
                "processionDateTime": "2025-08-03T07:00:00Z",
                "burialSiteInfo": "서울시립승화원",
                "chiefMourners": "배우자 이영희, 아들 김상주, 딸 김상미",
                "chiefMournersContact": "010-5555-6666 (아들 김상주)",
                "chiefMournerAccountHolder": "김상주",
                "chiefMournerBankName": "신한은행",
                "chiefMournerAccountNumber": "110-123-456789",
                "templateKeyword": "고요함",
                "_links": {
                    "self": {
                        "href": "http://funeralcontext:8080/schedules/2"
                    },
                    "schedule": {
                        "href": "http://funeralcontext:8080/schedules/2"
                    }
                }
            }
        ]
    },
    "_links": {
        "self": {
            "href": "http://funeralcontext:8080/schedules"
        },
        "profile": {
            "href": "http://funeralcontext:8080/profile/schedules"
        },
        "search": {
            "href": "http://funeralcontext:8080/schedules/search"
        }
    },
    "page": {
        "size": 20,
        "totalElements": 2,
        "totalPages": 1,
        "number": 0
    }
}


---


## 장례일정표 조회

▼▼▼ Request 샘플 (POSTMAN)
GET
http://localhost:8080/schedules/search/findFirstByCustomerIdOrderByScheduleIdDesc?customerId=1
---
None


동일한 정보로 2개 이상의 문서를 만든 상태에서
customerId로 검색했을 때 Id(PK)가 가장 높은값 1개만 반환

▲▲▲ Response 샘플 (POSTMAN)

{
    "funeralInfoId": 1,
    "scheduleTemplateId": null,
    "scheduleDallePrompt": "연한 수채화 느낌의 장례식 일정표 배경 이미지를 그려줘. 이미지는 세로형이며, 배경은 따뜻한 색상이고 중앙에는 넓은 여백이 있어야 해. 전체적인 분위기는 '불교' 종교와 '고요함' 키워드에 어울리도록 차분하고 정중하게 표현해줘. 불필요한 장식은 배제하고, 텍스트가 잘 읽힐 수 있도록 미니멀한 구성이면 좋겠어.텍스트, 문장, 알파벳, 글자는 절대로 포함하지 마세요. 오직 배경 그래픽만 포함된 미니멀한 이미지여야 합니다.",
    "scheduleDalleTemplateImageUrl": "https://a071098blobtest.blob.core.windows.net/a071098container/schedule-templates/template_2.png",
    "scheduleFileName": "schedules/schedule_2.png",
    "scheduleFileUrl": "https://a071098blobtest.blob.core.windows.net/a071098container/schedules/schedule_2.png",
    "scheduleStatus": "COMPLETED",
    "scheduleCreatedAt": "2025-08-09T00:22:58.793+00:00",
    "customerId": 1,
    "deceasedName": "김철수",
    "deceasedNameHanja": "金哲洙",
    "deceasedRrn": "430510-1000111",
    "deceasedAge": 82,
    "deceasedBirthOfDate": "1943-05-10T00:00:00.000+00:00",
    "deceasedGender": "남성",
    "deceasedDate": "2025-08-01T14:00:00.000+00:00",
    "deceasedReligion": "불교",
    "deceasedRegisteredAddress": "충청북도 청주시 상당구 문의면",
    "deceasedAddress": "서울특별시 종로구 세종대로 175",
    "deceasedRelationToHouseholdHead": "본인",
    "reportRegistrationDate": "2025-08-01T00:00:00.000+00:00",
    "deathLocation": "서울대학교병원",
    "deathLocationType": "2",
    "deathLocationEtc": null,
    "deathReportEtc": "지병으로 인한 사망",
    "reporterName": "이영희",
    "reporterRrn": "450815-2000222",
    "reporterQualification": "1",
    "reporterRelationToDeceased": "배우자",
    "reporterAddress": "서울특별시 종로구 세종대로 175",
    "reporterPhone": "010-3333-4444",
    "reporterEmail": "younghee.lee@example.com",
    "submitterName": "이영희",
    "submitterRrn": "450815-2000222",
    "funeralCompanyName": "GoldenGate",
    "directorName": "이장례",
    "directorPhone": "010-9876-5432",
    "funeralHomeName": "서울대학교병원 장례식장",
    "funeralHomeAddress": "서울특별시 종로구 대학로 101",
    "funeralHomeAddressUrl": null,
    "funeralDuration": "3일장",
    "mortuaryInfo": "특실 1호",
    "processionDateTime": "2025-08-03T07:00:00Z",
    "burialSiteInfo": "서울시립승화원",
    "chiefMourners": "배우자 이영희, 아들 김상주, 딸 김상미",
    "chiefMournersContact": "010-5555-6666 (아들 김상주)",
    "chiefMournerAccountHolder": "김상주",
    "chiefMournerBankName": "신한은행",
    "chiefMournerAccountNumber": "110-123-456789",
    "templateKeyword": "고요함",
    "_links": {
        "self": {
            "href": "http://funeralcontext:8080/schedules/2"
        },
        "schedule": {
            "href": "http://funeralcontext:8080/schedules/2"
        }
    }
}


---


## 장례정보 등록

▼▼▼ Request 샘플 (POSTMAN)
POST
http://localhost:8080/funeralInfos
---
{
    "customerId": 1,
    "deceasedName": "김철수",
    "deceasedRrn": "430510-1000111",
    "deceasedAge": 82,
    "deceasedBirthOfDate": "1943-05-10T00:00:00Z",
    "deceasedGender": "남성",
    "deceasedAddress": "서울특별시 종로구 세종대로 175",
    "deceasedDate": "2025-08-01T14:00:00Z",
    "funeralCompanyName": "GoldenGate",
    "directorName": "이장례",
    "directorPhone": "010-9876-5432"
}




▲▲▲ Response 샘플 (POSTMAN)
---
{
    "customerId": 1,
    "validationStatus": null,
    "deceasedName": "김철수",
    "deceasedNameHanja": null,
    "deceasedRrn": "430510-1000111",
    "deceasedAge": 82,
    "deceasedBirthOfDate": "1943-05-10T00:00:00.000+00:00",
    "deceasedGender": "남성",
    "deceasedDate": "2025-08-01T14:00:00.000+00:00",
    "deceasedReligion": null,
    "deceasedRegisteredAddress": null,
    "deceasedAddress": "서울특별시 종로구 세종대로 175",
    "deceasedRelationToHouseholdHead": null,
    "reportRegistrationDate": null,
    "deathLocation": null,
    "deathLocationType": null,
    "deathLocationEtc": null,
    "deathReportEtc": null,
    "reporterName": null,
    "reporterRrn": null,
    "reporterQualification": null,
    "reporterRelationToDeceased": null,
    "reporterAddress": null,
    "reporterPhone": null,
    "reporterEmail": null,
    "submitterName": null,
    "submitterRrn": null,
    "funeralCompanyName": "GoldenGate",
    "directorName": "이장례",
    "directorPhone": "010-9876-5432",
    "funeralHomeName": null,
    "funeralHomeAddress": null,
    "funeralHomeAddressUrl": null,
    "funeralDuration": null,
    "mortuaryInfo": null,
    "processionDateTime": null,
    "burialSiteInfo": null,
    "chiefMourners": null,
    "chiefMournersContact": null,
    "chiefMournerAccountHolder": null,
    "chiefMournerBankName": null,
    "chiefMournerAccountNumber": null,
    "templateKeyword": null,
    "_links": {
        "self": {
            "href": "http://funeralcontext:8080/funeralInfos/1"
        },
        "funeralInfo": {
            "href": "http://funeralcontext:8080/funeralInfos/1"
        },
        "updatefuneralinfo": {
            "href": "http://funeralcontext:8080/funeralInfos/1/updatefuneralinfo"
        },
        "createobituary": {
            "href": "http://funeralcontext:8080/funeralInfos/1/createobituary"
        },
        "createschedule": {
            "href": "http://funeralcontext:8080/funeralInfos/1/createschedule"
        },
        "createalldocuments": {
            "href": "http://funeralcontext:8080/funeralInfos/1/createalldocuments"
        },
        "createdeathreport": {
            "href": "http://funeralcontext:8080/funeralInfos/1/createdeathreport"
        }
    }
}


---


## 장례정보 전체 조회

▼▼▼ Request 샘플 (POSTMAN)
GET
http://localhost:8080/funeralInfos




▲▲▲ Response 샘플 (POSTMAN)

{
    "_embedded": {
        "funeralInfos": [
            {
                "customerId": 1,
                "validationStatus": "VALIDATED",
                "deceasedName": "김철수",
                "deceasedNameHanja": "金哲洙",
                "deceasedRrn": "430510-1000111",
                "deceasedAge": 82,
                "deceasedBirthOfDate": "1943-05-10T00:00:00.000+00:00",
                "deceasedGender": "남성",
                "deceasedDate": "2025-08-01T14:00:00.000+00:00",
                "deceasedReligion": "불교",
                "deceasedRegisteredAddress": "충청북도 청주시 상당구 문의면",
                "deceasedAddress": "서울특별시 종로구 세종대로 175",
                "deceasedRelationToHouseholdHead": "본인",
                "reportRegistrationDate": "2025-08-01T00:00:00.000+00:00",
                "deathLocation": "서울대학교병원",
                "deathLocationType": "2",
                "deathLocationEtc": null,
                "deathReportEtc": "지병으로 인한 사망",
                "reporterName": "이영희",
                "reporterRrn": "450815-2000222",
                "reporterQualification": "1",
                "reporterRelationToDeceased": "배우자",
                "reporterAddress": "서울특별시 종로구 세종대로 175",
                "reporterPhone": "010-3333-4444",
                "reporterEmail": "younghee.lee@example.com",
                "submitterName": "이영희",
                "submitterRrn": "450815-2000222",
                "funeralCompanyName": "GoldenGate",
                "directorName": "이장례",
                "directorPhone": "010-9876-5432",
                "funeralHomeName": "서울대학교병원 장례식장",
                "funeralHomeAddress": "서울특별시 종로구 대학로 101",
                "funeralHomeAddressUrl": null,
                "funeralDuration": "3일장",
                "mortuaryInfo": "특실 1호",
                "processionDateTime": "2025-08-03T07:00:00Z",
                "burialSiteInfo": "서울시립승화원",
                "chiefMourners": "배우자 이영희, 아들 김상주, 딸 김상미",
                "chiefMournersContact": "010-5555-6666 (아들 김상주)",
                "chiefMournerAccountHolder": "김상주",
                "chiefMournerBankName": "신한은행",
                "chiefMournerAccountNumber": "110-123-456789",
                "templateKeyword": "고요함",
                "_links": {
                    "self": {
                        "href": "http://funeralcontext:8080/funeralInfos/1"
                    },
                    "funeralInfo": {
                        "href": "http://funeralcontext:8080/funeralInfos/1"
                    },
                    "updatefuneralinfo": {
                        "href": "http://funeralcontext:8080/funeralInfos/1/updatefuneralinfo"
                    },
                    "createobituary": {
                        "href": "http://funeralcontext:8080/funeralInfos/1/createobituary"
                    },
                    "createschedule": {
                        "href": "http://funeralcontext:8080/funeralInfos/1/createschedule"
                    },
                    "createalldocuments": {
                        "href": "http://funeralcontext:8080/funeralInfos/1/createalldocuments"
                    },
                    "createdeathreport": {
                        "href": "http://funeralcontext:8080/funeralInfos/1/createdeathreport"
                    }
                }
            },
            {
                "customerId": 2,
                "validationStatus": null,
                "deceasedName": "김개똥",
                "deceasedNameHanja": null,
                "deceasedRrn": "430510-1000111",
                "deceasedAge": 82,
                "deceasedBirthOfDate": "1943-05-10T00:00:00.000+00:00",
                "deceasedGender": "남성",
                "deceasedDate": "2025-08-01T14:00:00.000+00:00",
                "deceasedReligion": null,
                "deceasedRegisteredAddress": null,
                "deceasedAddress": "서울특별시 종로구 세종대로 175",
                "deceasedRelationToHouseholdHead": null,
                "reportRegistrationDate": null,
                "deathLocation": null,
                "deathLocationType": null,
                "deathLocationEtc": null,
                "deathReportEtc": null,
                "reporterName": null,
                "reporterRrn": null,
                "reporterQualification": null,
                "reporterRelationToDeceased": null,
                "reporterAddress": null,
                "reporterPhone": null,
                "reporterEmail": null,
                "submitterName": null,
                "submitterRrn": null,
                "funeralCompanyName": "GoldenGate",
                "directorName": "이장례",
                "directorPhone": "010-9876-5432",
                "funeralHomeName": null,
                "funeralHomeAddress": null,
                "funeralHomeAddressUrl": null,
                "funeralDuration": null,
                "mortuaryInfo": null,
                "processionDateTime": null,
                "burialSiteInfo": null,
                "chiefMourners": null,
                "chiefMournersContact": null,
                "chiefMournerAccountHolder": null,
                "chiefMournerBankName": null,
                "chiefMournerAccountNumber": null,
                "templateKeyword": null,
                "_links": {
                    "self": {
                        "href": "http://funeralcontext:8080/funeralInfos/2"
                    },
                    "funeralInfo": {
                        "href": "http://funeralcontext:8080/funeralInfos/2"
                    },
                    "updatefuneralinfo": {
                        "href": "http://funeralcontext:8080/funeralInfos/2/updatefuneralinfo"
                    },
                    "createobituary": {
                        "href": "http://funeralcontext:8080/funeralInfos/2/createobituary"
                    },
                    "createschedule": {
                        "href": "http://funeralcontext:8080/funeralInfos/2/createschedule"
                    },
                    "createalldocuments": {
                        "href": "http://funeralcontext:8080/funeralInfos/2/createalldocuments"
                    },
                    "createdeathreport": {
                        "href": "http://funeralcontext:8080/funeralInfos/2/createdeathreport"
                    }
                }
            }
        ]
    },
    "_links": {
        "self": {
            "href": "http://funeralcontext:8080/funeralInfos"
        },
        "profile": {
            "href": "http://funeralcontext:8080/profile/funeralInfos"
        },
        "search": {
            "href": "http://funeralcontext:8080/funeralInfos/search"
        }
    },
    "page": {
        "size": 20,
        "totalElements": 2,
        "totalPages": 1,
        "number": 0
    }
}


---


## 장례정보 수정

▼▼▼ Request 샘플 (POSTMAN)
PUT 
http://localhost:8080/funeralInfos/1/updatefuneralinfo
---
{
    "customerId": 1,
    "deceasedName": "김철수",
    "deceasedNameHanja": "金哲洙",
    "deceasedRrn": "430510-1000111",
    "deceasedAge": 82,
    "deceasedBirthOfDate": "1943-05-10T00:00:00Z",
    "deceasedGender": "남성",
    "deceasedDate": "2025-08-01T14:00:00Z",
    "deceasedReligion": "불교",
    "deceasedRegisteredAddress": "충청북도 청주시 상당구 문의면",
    "deceasedAddress": "서울특별시 종로구 세종대로 175",
    "deceasedRelationToHouseholdHead": "본인",
    "reportRegistrationDate": "2025-08-01T00:00:00Z",
    "deathLocation": "서울대학교병원",
    "deathLocationType": "2",
    "deathLocationEtc": null,
    "deathReportEtc": "지병으로 인한 사망",
    "reporterName": "이영희",
    "reporterRrn": "450815-2000222",
    "reporterQualification": "1",
    "reporterRelationToDeceased": "배우자",
    "reporterAddress": "서울특별시 종로구 세종대로 175",
    "reporterPhone": "010-3333-4444",
    "reporterEmail": "younghee.lee@example.com",
    "submitterName": "이영희",
    "submitterRrn": "450815-2000222",
    "funeralCompanyName": "GoldenGate",
    "directorName": "이장례",
    "directorPhone": "010-9876-5432",
    "funeralHomeName": "서울대학교병원 장례식장",
    "funeralHomeAddress": "서울특별시 종로구 대학로 101",
    "funeralHomeAddressUrl": null,
    "funeralDuration": "3일장",
    "mortuaryInfo": "특실 1호",
    "processionDateTime": "2025-08-03T07:00:00Z",
    "burialSiteInfo": "서울시립승화원",
    "chiefMourners": "배우자 이영희, 아들 김상주, 딸 김상미",
    "chiefMournersContact": "010-5555-6666 (아들 김상주)",
    "chiefMournerAccountHolder": "김상주",
    "chiefMournerBankName": "신한은행",
    "chiefMournerAccountNumber": "110-123-456789",
    "templateKeyword": "고요함"
}


▲▲▲ Response 샘플 (POSTMAN)
---
{
    "funeralInfoId": 1,
    "customerId": 1,
    "validationStatus": "VALIDATED",
    "deceasedName": "김철수",
    "deceasedNameHanja": "金哲洙",
    "deceasedRrn": "430510-1000111",
    "deceasedAge": 82,
    "deceasedBirthOfDate": "1943-05-10T00:00:00.000+00:00",
    "deceasedGender": "남성",
    "deceasedDate": "2025-08-01T14:00:00.000+00:00",
    "deceasedReligion": "불교",
    "deceasedRegisteredAddress": "충청북도 청주시 상당구 문의면",
    "deceasedAddress": "서울특별시 종로구 세종대로 175",
    "deceasedRelationToHouseholdHead": "본인",
    "reportRegistrationDate": "2025-08-01T00:00:00.000+00:00",
    "deathLocation": "서울대학교병원",
    "deathLocationType": "2",
    "deathLocationEtc": null,
    "deathReportEtc": "지병으로 인한 사망",
    "reporterName": "이영희",
    "reporterRrn": "450815-2000222",
    "reporterQualification": "1",
    "reporterRelationToDeceased": "배우자",
    "reporterAddress": "서울특별시 종로구 세종대로 175",
    "reporterPhone": "010-3333-4444",
    "reporterEmail": "younghee.lee@example.com",
    "submitterName": "이영희",
    "submitterRrn": "450815-2000222",
    "funeralCompanyName": "GoldenGate",
    "directorName": "이장례",
    "directorPhone": "010-9876-5432",
    "funeralHomeName": "서울대학교병원 장례식장",
    "funeralHomeAddress": "서울특별시 종로구 대학로 101",
    "funeralHomeAddressUrl": null,
    "funeralDuration": "3일장",
    "mortuaryInfo": "특실 1호",
    "processionDateTime": "2025-08-03T07:00:00Z",
    "burialSiteInfo": "서울시립승화원",
    "chiefMourners": "배우자 이영희, 아들 김상주, 딸 김상미",
    "chiefMournersContact": "010-5555-6666 (아들 김상주)",
    "chiefMournerAccountHolder": "김상주",
    "chiefMournerBankName": "신한은행",
    "chiefMournerAccountNumber": "110-123-456789",
    "templateKeyword": "고요함"
}


---


## 장례서류 검토 요청

# FE에서 전달할 때 예상 API 코드입니다. 
# 좌측은 Java(BE) 속성명 : 우측은 JS(FE) 속성명
📥 Request 샘플 (POSTMAN)
POST http://localhost:8080/funeralInfos/validate-fields
---
{
    "deceasedName": "{deceasedName}",
    "deceasedNameHanja": "{deceasedNameHanja}",
    "deceasedAge": "{deceasedAge}",
    "deceasedBirthOfDate": "{deceasedBirthOfDate}",
    "deceasedDate": "{deceasedDate}",
    "deceasedRegisteredAddress": "{deceasedRegisteredAddress}",
    "deceasedAddress": "{deceasedAddress}",
    "deceasedRelationToHouseholdHead": "{deceasedRelationToHouseholdHead}",
    "reportRegistrationDate": "{reportRegistrationDate}",
    "deathLocation": "{deathLocation}",
    "deathLocationEtc": "{deathLocationEtc}",
    "deathReportEtc": "{deathReportEtc}",
    "reporterName": "{reporterName}",
    "reporterRelationToDeceased": "{reporterRelationToDeceased}",
    "reporterAddress": "{reporterAddress}",
    "submitterName": "{submitterName}",
    "directorName": "{directorName}",
    "funeralHomeName": "{funeralHomeName}",
    "funeralHomeAddress": "{funeralHomeAddress}",
    "funeralDuration": "{funeralDuration}",
    "mortuaryInfo": "{mortuaryInfo}",
    "processionDateTime": "{processionDateTime}",
    "burialSiteInfo": "{burialSiteInfo}",
    "chiefMourners": "{chiefMourners}",
    "chiefMournerAccountHolder": "{chiefMournerAccountHolder}",
    "templateKeyword": "{templateKeyword}"
}
-------------------------------------------
# 속성명에 따라서 들어가는 값 예시
{
    "deceasedName": "김철수우",
    "deceasedNameHanja": "金哲洙",
    "deceasedAge": 82,
    "deceasedBirthOfDate": "1943-05-10T00:00:00Z",
    "deceasedDate": "1940-08-01T14:00:00Z",
    "deceasedRegisteredAddress": "충청북도 청주시 상당구 문의면",
    "deceasedAddress": "서울특별시 종로구 세종대로 175",
    "deceasedRelationToHouseholdHead": "본인",
    "reportRegistrationDate": "2025-08-01T00:00:00Z",
    "deathLocation": "서울대학교병원",
    "deathLocationEtc": null,
    "deathReportEtc": "지병으로 인한 사망",
    "reporterName": "이영희",
    "reporterRelationToDeceased": "배우자",
    "reporterAddress": "서울특별시 종로구 세종대로 175",
    "submitterName": "이영희",
    "directorName": "이장례",
    "funeralHomeName": "서울대학교병원 장래식장",
    "funeralHomeAddress": "서울특별시 종로구 대학로 101",
    "funeralDuration": "3일장",
    "mortuaryInfo": "특실 1호",
    "processionDateTime": "2025-08-03T07:00:00Z",
    "burialSiteInfo": "서울시립승화원",
    "chiefMourners": "배우자 이영희, 아들 김상주, 딸 김상미",
    "chiefMournerAccountHolder": "김상주",
    "templateKeyword": "고요함"
}


📤 Response 샘플 (POSTMAN)
# API 요청으로 50개를 보내주셔도, 속성값중에 문제가 있는 것만 경고 메세지를 반환합니다.
---
{
    "warnings": [
        {
            "fieldName": "deceasedName",
            "warningDescription": "이름에 부자연스러운 반복이 있습니다.",
            "suggestion": "이름을 '김철수'로 수정하는 것이 좋습니다."
        },
        {
            "fieldName": "deceasedBirthOfDate",
            "warningDescription": "생년월일이 사망일보다 이후입니다.",
            "suggestion": "생년월일과 사망일을 확인하고 올바르게 수정하세요."
        },
        {
            "fieldName": "deceasedAge",
            "warningDescription": "입력된 나이가 생년월일 기준으로 계산된 나이와 일치하지 않습니다.",
            "suggestion": "생년월일을 기준으로 나이를 다시 계산하여 수정하세요."
        },
    ]
}


---


## 