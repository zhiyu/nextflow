export default function componentStyleOverrides(theme) {
    const bgColor = theme.colors?.grey50
    return {
        MuiAppBar: {
            styleOverrides: {
                root: {
                    boxShadow: 'none'
                    // borderBottom: '1px solid rgba(0, 0, 0, 0.12)'
                }
            }
        },
        MuiToolbar: {
            styleOverrides: {
                root: {
                    borderBottom: '0px solid !important'
                }
            }
        },
        MuiButton: {
            styleOverrides: {
                root: {
                    boxShadow: 'none'
                }
            }
        },
        MuiToggleButton: {
            styleOverrides: {
                root: {
                    '&.Mui-selected': {}
                }
            }
        },
        MuiTableContainer: {
            styleOverrides: {
                root: {
                    boxShadow: '0 0px 16px 0px rgba(0, 0, 0, 0.02)',
                    padding: '0px 16px',
                    'th,td': {
                        borderBottom: '1px solid ' + theme.divider
                    }
                }
            }
        },
        MuiTableRow: {
            styleOverrides: {
                root: {
                    '&:last-child td': {
                        border: 0
                    }
                }
            }
        },
        MuiListItemButton: {
            styleOverrides: {
                root: {
                    color: theme.darkTextPrimary,
                    paddingTop: '5px !important',
                    paddingBottom: '5px !important',
                    paddingLeft: '14px !important',
                    paddingRight: '14px !important',
                    margin: '0px 10px',
                    borderRadius: `${theme?.customization?.borderRadius}px`,
                    // borderLeft: '2px solid transparent',
                    // borderRight: '2px solid transparent',
                    '&.Mui-selected': {
                        color: theme.menuSelected,
                        // borderRight: '2px solid ' + theme.menuSelected,
                        // borderLeft: '2px solid ' + theme.menuSelected,
                        backgroundColor: theme.menuSelectedBack,
                        '&:hover': {
                            backgroundColor: theme.menuSelectedBack
                        },
                        '& .MuiListItemIcon-root': {
                            color: theme.menuSelected
                        }
                    },
                    '&:hover': {
                        backgroundColor: 'transparent',
                        color: theme.menuSelected,
                        '& .MuiListItemIcon-root': {
                            color: theme.menuSelected
                        }
                    }
                }
            }
        },
        MuiListItemIcon: {
            styleOverrides: {
                root: {
                    color: theme.darkTextPrimary,
                    minWidth: 24
                }
            }
        },
        MuiListItemText: {
            styleOverrides: {
                root: {
                    '.MuiTypography-root': {
                        // fontWeight: '400'
                    }
                },
                primary: {
                    color: theme.textDark
                }
            }
        },
        MuiOutlinedInput: {
            styleOverrides: {
                root: {
                    background: theme?.customization?.isDarkMode ? theme.colors?.darkPrimary800 : bgColor
                },
                input: {
                    fontWeight: 500,
                    borderRadius: `${theme?.customization?.borderRadius}px`,
                    '&.MuiInputBase-inputSizeSmall': {
                        padding: '10px 14px',
                        '&.MuiInputBase-inputAdornedStart': {
                            paddingLeft: 0
                        }
                    }
                },
                inputAdornedStart: {
                    paddingLeft: 4
                },
                notchedOutline: {
                    borderRadius: `${theme?.customization?.borderRadius}px`
                }
            }
        }
        // MuiDialogActions: {
        //     styleOverrides: {
        //         root: {
        //             padding: '6px 40px !important',
        //             borderTop: '1px solid ' + theme.colors.grey200
        //         }
        //     }
        // },
        // MuiDialogTitle: {
        //     styleOverrides: {
        //         root: {
        //             padding: '12px 24px !important',
        //             borderBottom: '1px solid ' + theme.colors.grey200
        //         }
        //     }
        // },
        // MuiDialogContent: {
        //     styleOverrides: {
        //         root: {
        //             paddingTop: '20px !important'
        //         }
        //     }
        // },

        // MuiTypography: {
        //     styleOverrides: {
        //         root: {
        //             fontSize: '1em'
        //         }
        //     }
        // },
        // MuiCssBaseline: {
        //     styleOverrides: {
        //         body: {
        //             scrollbarWidth: 'thin',
        //             scrollbarColor: theme?.customization?.isDarkMode
        //                 ? `${theme.colors?.grey500} ${theme.colors?.darkPrimaryMain}`
        //                 : `${theme.colors?.grey300} ${theme.paper}`,
        //             '&::-webkit-scrollbar, & *::-webkit-scrollbar': {
        //                 width: 12,
        //                 height: 12,
        //                 backgroundColor: theme?.customization?.isDarkMode ? theme.colors?.darkPrimaryMain : theme.paper
        //             },
        //             '&::-webkit-scrollbar-thumb, & *::-webkit-scrollbar-thumb': {
        //                 borderRadius: 8,
        //                 backgroundColor: theme?.customization?.isDarkMode ? theme.colors?.grey500 : theme.colors?.grey300,
        //                 minHeight: 24,
        //                 border: `3px solid ${theme?.customization?.isDarkMode ? theme.colors?.darkPrimaryMain : theme.paper}`
        //             },
        //             '&::-webkit-scrollbar-thumb:focus, & *::-webkit-scrollbar-thumb:focus': {
        //                 backgroundColor: theme?.customization?.isDarkMode ? theme.colors?.darkPrimary200 : theme.colors?.grey500
        //             },
        //             '&::-webkit-scrollbar-thumb:active, & *::-webkit-scrollbar-thumb:active': {
        //                 backgroundColor: theme?.customization?.isDarkMode ? theme.colors?.darkPrimary200 : theme.colors?.grey500
        //             },
        //             '&::-webkit-scrollbar-thumb:hover, & *::-webkit-scrollbar-thumb:hover': {
        //                 backgroundColor: theme?.customization?.isDarkMode ? theme.colors?.darkPrimary200 : theme.colors?.grey500
        //             },
        //             '&::-webkit-scrollbar-corner, & *::-webkit-scrollbar-corner': {
        //                 backgroundColor: theme?.customization?.isDarkMode ? theme.colors?.darkPrimaryMain : theme.paper
        //             }
        //         }
        //     }
        // },

        // MuiSvgIcon: {
        //     styleOverrides: {
        //         root: {
        //             color: theme?.customization?.isDarkMode ? theme.colors?.paper : 'inherit',
        //             background: theme?.customization?.isDarkMode ? theme.colors?.darkPrimaryLight : 'inherit'
        //         }
        //     }
        // },
        // MuiPaper: {
        //     defaultProps: {
        //         elevation: 0
        //     },
        //     styleOverrides: {
        //         root: {
        //             backgroundImage: 'none'
        //         }
        //     }
        // },
        // MuiCard: {
        //     styleOverrides: {
        //         root: {
        //             minHeight: '120px'
        //         }
        //     }
        // },
        // MuiCardHeader: {
        //     styleOverrides: {
        //         root: {
        //             color: theme.colors?.textDark,
        //             padding: '24px'
        //         },
        //         title: {
        //             fontSize: '1.125rem'
        //         }
        //     }
        // },
        // MuiCardContent: {
        //     styleOverrides: {
        //         root: {
        //             padding: '24px'
        //         }
        //     }
        // },
        // MuiCardActions: {
        //     styleOverrides: {
        //         root: {
        //             padding: '24px'
        //         }
        //     }
        // },

        // MuiInputBase: {
        //     styleOverrides: {
        //         input: {
        //             color: theme.textDark,
        //             '&::placeholder': {
        //                 color: theme.darkTextSecondary,
        //                 fontSize: '0.875rem'
        //             },
        //             '&.Mui-disabled': {
        //                 WebkitTextFillColor: theme?.customization?.isDarkMode ? theme.colors?.grey500 : theme.darkTextSecondary
        //             }
        //         }
        //     }
        // },

        // MuiSlider: {
        //     styleOverrides: {
        //         root: {
        //             '&.Mui-disabled': {
        //                 color: theme.colors?.grey300
        //             }
        //         },
        //         mark: {
        //             backgroundColor: theme.paper,
        //             width: '4px'
        //         },
        //         valueLabel: {
        //             color: theme?.colors?.primaryLight
        //         }
        //     }
        // },
        // MuiDivider: {
        //     styleOverrides: {
        //         root: {
        //             borderColor: theme.divider,
        //             opacity: 1
        //         }
        //     }
        // },
        // MuiAvatar: {
        //     styleOverrides: {
        //         root: {
        //             color: theme.colors?.primaryDark,
        //             background: theme.colors?.primary200
        //         }
        //     }
        // },
        // MuiChip: {
        //     styleOverrides: {
        //         root: {
        //             '&.MuiChip-deletable .MuiChip-deleteIcon': {
        //                 color: 'inherit'
        //             }
        //         }
        //     }
        // },
        // MuiTooltip: {
        //     styleOverrides: {
        //         tooltip: {
        //             color: theme?.customization?.isDarkMode ? theme.colors?.paper : theme.paper,
        //             background: theme.colors?.grey700
        //         }
        //     }
        // },
        // MuiAutocomplete: {
        //     styleOverrides: {
        //         option: {
        //             '&:hover': {
        //                 background: theme?.customization?.isDarkMode ? '#233345 !important' : ''
        //             }
        //         }
        //     }
        // }
    }
}
