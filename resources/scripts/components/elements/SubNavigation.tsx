import styled from 'styled-components/macro';
import tw, { theme } from 'twin.macro';

const SubNavigation = styled.div`
    ${tw`w-full bg-neutral-800 shadow overflow-x-auto`};

    @media (min-width: 768px) {
        ${tw`w-56 flex-none sticky top-4 rounded-lg border border-neutral-700 overflow-visible`};
    }


    & > div {
        ${tw`flex items-center text-sm mx-auto px-2`};

        @media (min-width: 768px) {
            ${tw`flex-col items-stretch mx-0 px-2 py-3`};
        }
        max-width: 1200px;

        & > a,
        & > div {
            ${tw`inline-block py-3 px-4 text-neutral-300 no-underline whitespace-nowrap transition-all duration-150`};

            @media (min-width: 768px) {
                ${tw`block py-2.5 px-3 rounded`};
                margin-left: 0 !important;
            }

            &:not(:first-of-type) {
                ${tw`ml-2`};
            }

            &:hover {
                ${tw`text-neutral-100`};
            }

            &:active,
            &.active {
                ${tw`text-neutral-100`};
                box-shadow: inset 0 -2px ${theme`colors.primary.500`.toString()};

                @media (min-width: 768px) {
                    box-shadow: inset 2px 0 ${theme`colors.primary.500`.toString()};
                }
            }
        }
    }
`;

export default SubNavigation;
