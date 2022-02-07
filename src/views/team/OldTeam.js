{/*<List dense className={"w-100"}>
                <ListSubheader className="searchbox-holder">
                    <div className="d-flex align-items-center searchbox pt-4">
                        <SearchOutlined />
                        <input onKeyUp={filterUsers} type="text" className="search-input w-100" placeholder="Szűrés név vagy e-mail alapján..." />
                    </div>
                </ListSubheader>
                {filteredMembers.map((member) => {
                    const labelId = `checkbox-list-secondary-label-${member.email}`;
                    return (
                        <ListItem key={Math.random()*10000} button>
                            <ListItemIcon onClick={handleToggle(member.email)}>
                                <Checkbox
                                    edge="start"
                                    checked={checked.indexOf(member.email) !== -1}
                                    tabIndex={-1}
                                    disableRipple
                                    inputProps={{ 'aria-labelledby': labelId }}
                                />
                            </ListItemIcon>
                            <ListItem>
                                <ListItemAvatar>
                                    <Avatar style={{backgroundColor: stringToColor(member.email)}}>
                                        { member.name.charAt(0) }
                                    </Avatar>
                                </ListItemAvatar>
                                <ListItemText primary={member.name} secondary={member.email} />
                            </ListItem>
                            <ListItem>
                                <ListItemText primary={member.role} />
                            </ListItem>
                            <ListItem>
                                <ListItemText primary="Meghívva" />
                            </ListItem>
                            <ListItem>
                                <ListItemText primary={new Date().toISOString().slice(0, 10)} />
                            </ListItem>
                        </ListItem>
                    );
                })}
            </List>*/}