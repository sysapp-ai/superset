import React from 'react';
import PropTypes from 'prop-types';
import { styled } from '@superset-ui/core';
import {
  FaArrowUp,
  FaUser,
  FaFileAlt,
  FaCreditCard,
  FaChartBar,
  FaCheck,
  FaCheckCircle
} from 'react-icons/fa';
import { TiGroup } from 'react-icons/ti';
import { FaFilePen, FaRegCalendarCheck, FaHandHoldingDollar, FaArrowTrendUp, FaArrowTrendDown } from 'react-icons/fa6';
import { MdOutlineCancel, MdCancelPresentation, MdContactPhone, MdPendingActions } from 'react-icons/md';
import { IoSpeedometer } from "react-icons/io5";
import { TbMessageCancel, TbCalendarCancel } from "react-icons/tb";
import { HiOutlineClipboardDocumentList } from "react-icons/hi2";
import { ImClipboard } from "react-icons/im";
import { BsClipboard2X } from "react-icons/bs";
import TaskIcon from '../src/icons/TaskIcon';
import SandClockOutline from './icons/SandClockOutline';
import SandClock from './icons/SandClock';

/* ================= Layout ================= */

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: ${({ theme }) => theme.gridUnit * 5}px;
  padding: ${({ theme }) => theme.gridUnit * 4}px;
`;

/* ================= Item ================= */

const Item = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.gridUnit * 3}px;
  cursor: pointer;
  transition: all 0.25s ease;

  &:hover {
    transform: translateY(-3px);

    .icon {
      transform: scale(1.08);
      box-shadow: 0 6px 14px rgba(0, 0, 0, 0.12);
    }

    .value {
      color: ${({ theme }) => theme.colors.primary.dark1};
    }
  }
`;

/* ================= Icon ================= */

const IconWrapper = styled.div`
  width: ${({ size }) => size + 18}px;
  height: ${({ size }) => size + 18}px;
  border-radius: ${({ size }) => Math.max(10, size / 2)}px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${({ bgStart, bgEnd }) =>
    `linear-gradient(135deg, ${bgStart}, ${bgEnd})`};
  color: ${({ iconColor }) => iconColor || '#08979c'};
  transition: all 0.25s ease;

  svg {
    width: ${({ size }) => size}px;
    height: ${({ size }) => size}px;
  }
`;

/* ================= Text ================= */

const Text = styled.div`
  display: flex;
  flex-direction: column;
`;

const Title = styled.div`
  letter-spacing: 0.3px;
  color: ${({ theme }) => theme.colors.grayscale.dark2};
`;

const Value = styled.div`
  font-weight: 600;
  line-height: 1.2;
  color: ${({ theme }) => theme.colors.grayscale.dark1};
  transition: color 0.25s ease;
`;

/* ================= Icons ================= */

const ICON_MAP = [
  FaArrowUp,
  FaUser,
  FaFileAlt,
  FaCreditCard,
  FaChartBar,
  TiGroup,
  FaFilePen,
  MdOutlineCancel,
  MdCancelPresentation,
  FaRegCalendarCheck,
  FaHandHoldingDollar,
  MdContactPhone,
  IoSpeedometer,
  TbMessageCancel,
  TbCalendarCancel,
  FaArrowTrendUp,
  FaArrowTrendDown,
  FaCheck,
  FaCheckCircle,
  HiOutlineClipboardDocumentList,
  ImClipboard,
  BsClipboard2X,
  MdPendingActions,
  TaskIcon,
  SandClockOutline,
  SandClock,
];

/* ================= Component ================= */

export default function SupersetPluginIconChart({ data }) {
  return (
    <Grid>
      {data.map(item => {
        const Icon = ICON_MAP[item.iconIndex] || FaArrowUp;
        const iconSize = item.iconSize || 22;
        const labelFontSize = item.labelFontSize || 12;

        return (
          <Item key={item.key}>
            {item.showIcon && (
              <IconWrapper
                className="icon"
                size={iconSize}
                iconColor={item.iconColor}
                bgStart={item.iconBgStart}
                bgEnd={item.iconBgEnd}
              >
                <Icon />
              </IconWrapper>
            )}

            <Text>
              {item.showLabel && (
                <Title style={{ fontSize: `${labelFontSize}px` }}>
                  {item.label}
                </Title>
              )}
              <Value className="value" style={{ fontSize: `${item.valueFontSize}px` }} > {item.formattedValue}</Value>
            </Text>
          </Item>
        );
      })}
    </Grid>
  );
}

SupersetPluginIconChart.propTypes = {
  data: PropTypes.array.isRequired,
};
