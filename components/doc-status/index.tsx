import React from "react"
import {isUndefined, get} from "lodash";
import {useTranslation} from "react-i18next";
import {Badge} from "native-base";

const DocflowStatus = ({
                           statusKey = 'docStatus',
                           item = {}
                       }) => {
    const {t} = useTranslation();
    let stateTitle = {
        new: t("new"),
        newed: t("newed"),
        registered: t("registered"),
        on_resolution: t("on_resolution"),
        on_execution: t("on_execution"),
        on_register: t("on_register"),
        executed: t("executed"),
        not_executed: t("not_executed"),
        deadline_on_time: t("deadline_on_time"),
        deadline_overdue: t("deadline_overdue"),
        on_check_department: t("on_check_department"),
        on_check_registrar: t("on_check_registrar"),
        on_check_control_card_controller: t("on_check_control_card_controller"),
        reject_department: t("reject_department"),
        reject_registrar: t("reject_registrar"),
        reject_control_card_controller: t("reject_control_card_controller"),
        accept_department: t("accept_department"),
        accept_registrar: t("accept_registrar"),
        accept_control_card_controller: t("accept_control_card_controller"),
        on_sign: t("on_sign"),
        on_checker_sign: t("on_checker_sign"),
        reject_checker_sign: t("reject_checker_sign"),
        accept_checker_sign: t("accept_checker_sign"),
        reject_sign: t("Откленоно подпись"),
        accept_sign: t("reject_sign"),
        on_signed: t("on_signed"),
        on_checker_chairman: t("on_checker_chairman"),
        on_chairman: t("on_chairman")
    };
    let stateClass = {
        new: "green",
        newed: "green",
        registered: "blue",
        on_resolution: "orange",
        on_execution: "geekblue",
        executed: "blue",
        not_executed: "orange",
        deadline_overdue: "red",
        deadline_on_time: "primary",
        on_check_department: "magenta",
        on_check_registrar: "magenta",
        on_check_control_card_controller: "magenta",
        reject_department: "red",
        reject_registrar: "red",
        reject_control_card_controller: "red",
        accept_department: "blue",
        accept_registrar: "blue",
        accept_control_card_controller: "blue",
        on_register: "green",
        on_checker_sign: "blue",
        reject_checker_sign: "red",
        accept_checker_sign: "blue",
        reject_sign: "red",
        accept_sign: "blue",
        on_checker_chairman: "blue",
        on_chairman: "blue",
        on_sign: "green",
        on_signed: "green"
    };

    if (!isUndefined(item)) {
        if (item.hasOwnProperty("currentState")) {
            // @ts-ignore
            const {currentState} = item;
            delete currentState.deadline_overdue;
        }
    }

    return (
        <>
            <Badge    colorScheme={get(
                stateClass,
                get(item,statusKey),
                "default"
            )}>{t(
                get(
                    stateTitle,
                    get(item,statusKey),
                    t("Неизствено")
                )
            )}
            </Badge>
        </>
    );
}

export default DocflowStatus;