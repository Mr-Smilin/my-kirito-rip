import { useEffect, useRef } from "react";

const Kirito = () => {
	const hasLogged = useRef(false);
	useEffect(() => {
		if (hasLogged.current) return;
		hasLogged.current = true;
		console.info(`        ██ ██                                                                    ███████         █████                     
        ██ ███                                                                  █████████      ███████                     
        ██  ███                                                                ██████████████████████                      
        █    ███                                                              ████████████████████████                     
        █    █ ██                                                            ██████████████████████████                    
        █     █ ██                                                   ██     ████████████████████████████                   
        █     ██ ██                                                 ████████████████████████████████████                   
        █      █  ██                                                █████████████████████████████████████                  
        █          ██                                             █████████████████████████████████████████                
        █    █  █   ██                                        ███████████████████████████████████████████████              
        █       ██   ██                                      █████████████████████████████████████████████████             
        █       ███  ██                                      ███████████████████████████████████████████████████           
        █       █ ██  ██                                 █████████████████████         ███████████████████████████         
        █       █████  ██                            █████████████████████████           ██████████████████████████        
        █       ██████  ██                        ████████████████  ██████████            ██████████████████████████       
        █       ██████  ██                     ████████████████ ██████████████               ██ ████████████████████       
        █       ███████  ██                ████████████████ ████    █████████████                ███████████████████       
        █       █ ██████  █             ███████████████  ███          ████    ████                █████████████████        
        █       ████████  ██        ███████████████  ███              ████████  ███                 ███████████████        
        █       █ ██████   █    ███████████████  ████               ████████████████                  ████████████         
        █   █   ██████████  ████████████████ ████                ████████████████████                  ███████████         
        █       █████████ █ █████████████████              ██████████████████████████                 ████████████         
        █       ██████████ █ ███████  ███                  ██████████████████████████                █████████████         
        █       ██████████   ████████                    ██████████████████████████████              █████████████         
        █      ██ █████ ███ █ ████                      ██████████████████████████████████         ███████████████         
        █       ██ ██████ █   █                       ████████████████████████████████████        ████████████████         
       ██      ██ █████ ███                           ███████████████████████████████████       █████████████████          
   ██████       ██████ █ ██   █                     ███████████████████████████████████████    ██████████████████          
█████████       █  █████ ██   █                      ████████████████████████████████████████████████████████████          
█████████      ██ ██ ██ ███   █                      █  █████████████████████████████████████████████████████████          
█████████       █ ████ ████   █                       ███████████████████████████████████████████████████████████          
███ █████       ███ █ ██  █                          ███████████████████████████████████████████████████████████           
█████   █       █  ████ ███  █                      ████████████████████████████████████████████████████████████           
        █ █     █ ██ ██  ██                         ████████████████████████████████████████████████████████████           
        █       █ █ ████                             ██████████████████████████████████████████████████████████            
        █       █ █ ██  ██    █                     ███████████████████████████████████████████████████████████            
        █       █ ███ █ █     █                    ███████████████████████████████████████████████████████████             
                █  █ █ █ ██    █                    ██████████████████████████████████████████████████████████             
                ██ █ █ █ █     █                 █ ██████████████████████████████████████████████████████████              
         █       █  █ █ █ █   ██                 ████ █████████████████ █████████████████████████████████████              
         ███   █  █   █ █ █    █               █   ████████████████████  ████████████████████████████████████              
            ██     ██ █ █ █    █               █  █████████████████████  ███████████████████████████████████               
           █████   ██  █ █      █                ███ ██████████████████   ██ ███████████████████████████████               
           ██  ███   █  █ █     █                 ██ █████████ ████████   ██  ██████████████████████████████               
                 ██  ██ ██          █                █████████ ████████    █████████████████████████████████               
                  ██   █         █ █                 ██████████████████    ███  █████████████████████████████              
                   █   ██ █       █                  ██████████████████  ████████  ██████████████████████████              
                   █    █   █    ██                 ████ ██████ ███████ ██████████ ██████████████████████████              
                    █   █        ██                 ████ █████  █████████████████  ██████████████████████████              
                         █                          ███   █████ █████████  ██████  ██████████████████████████              
                     █   █        ██                ██    █████ ██ ███ █   ███     ██████████████████████████              
                         ██        █                █     █████     ██ █  ████     ██████████████████████████              
                      █   █        █ ███            █      ████    █ █           █████████████████████████████             
                      █   █         ██                      ███   ██       █   ███████████████████████████████             
                       █   █     █  █                       █ █   ██   █  █   █████████████████████████████████            
                           █        ██                         █   █      █  ██████████████████████████████████████████    
                        █   █        █                          █            ██████████████████████████████████████████████
                        █   █        █          ▄▄███████▄       █   ███ ██ ███████████████████████████████████████████████
                            ██  █    ██        ████ MYKIRITO      ██  █  ██████████████████████████████████████████████████
                         █   █        █        ████ 2020-2024      ██      ████████████████████████████████████████████████
                             █        ██       ████  R.I.P          ██    █████████████████████████████████████████████████
                          █   █        █         ▀▀███████▀           █  ██████████████████████████████████████████████████
                           █  █        █                               ████████████████████████████████████████████████████
                           █   █    █  ██          We'll meet again...    █████████████████████████████████████████████████
                               █       ██                                 █████████████████████████████████████████████████
                            █  ██    █  █                                ██████████████████████████████████████████████████
                                █   █   ██                              ███████████████████████████████████████████████████
                             █  █  █ █  ██                             █  █████████████████████████████████████████████████
                                 █  █ █  ██                           █  ██████████████████████████████████████████████████
                              █  █  █    ██                           █ ███████████████████████████████████████████████████
                                  █   ███ ██                         █ ████████████████████████████████████████████████████
                               █  █  █ ██ ██                         ██████████████████████████████████████████████████████
                                   █  ██████                         ██████████████████████████████████████████████████████
                                █  █  █ ██ ██                        ██████████████████████████████████████████████████████
                                    █ ██ █ ██                        ██████████████████████████████████████████████████████
                                 █  █  █ ██ █                        ██████████████████████████████████████████████████████
                                    ██ ████ ███                     ███████████████████████████████████████████████████████
                                  █  █  ███████                    ████████████████████████████████████████████████████████
                                  █  ██ ████ ██                   █████████████████████████████████████████████████████████
                                   █  █ ███████                   █████████████████████████████████████████████████████████
                                   █  █  ██████                    ████████████████████████████████████████████████████████
                                    █  █ ████ █                    ████████████████████████████████████████████████████████
                                    █  █  ██████                 ██████████████████████████████████████████████████████████
                                     █ ██ ██████                ███████████████████████████████████████████████████████████
                                     █  █ ███████              ████████████████████████████████████████████████████████████
                                      █ ██ ██████  █          █████████████████████████████████████████████████████████████
                                      █  █ ██████   █         █████████████████████████████████████████████████████████████
                                         █  ██████   █       ████████████████████ █████████████████████████████████████████
                                       █  █ ████ █           ████████████████████ █████████████████████████████████████████
                                          █ ████ █           ███████████████████   ████████████████████████████████████████
                                        █ ██ ██████          ███████████████████    ███████████████████████████████████████
                                        ██ █ ████ ██         ███████████████████     ██████████████████████████████████████
                                         █ █  ██████         ██████████████████       █████████████████████████████████████
                                         █  █ ███████        ██████████████████    ███ ████████████████████████████████████
                                         █  █ ████████      ███████████████████    ████████████████████████████████████████
                                         ██ █  █████        ██████████████████   █ ████████████████████████████████████████
                                         ██ █  ██████       ███████████████████ ███████████████████████████████████████████
                                         █████  █████      ████████████████████████████████████████████████████████████████
                                          █████ ██████     ████████████████████████████████████████████████████████████████
                                           █████ ██████████████████████████████████████████████████████████████████████████
                                            ████ ██████████████████████████████████████████████████████████████████████████
                                         █████ ████████████████████████████████████████████████████████████████████████████
                                     ██████████ ███████████████████████████████████████████████████████████████████████████
                                  █████████████ ███████████████████████████████████████████████████████████████████████████
                               ████████████████ ███ ██████████████ ████████████████████████████████████████████████████████
                             █████████████████ █████ ███ ████████  ███████████████████████████████████████████████     ████
                           ███████████████████ █████ ███ ███████  ██████████████████████████████████████████████        ███
                         █████████████████████  ███████████████  ███████████████████████████████████████████████         ██
                       ███████████████████████ ████ ██ ███████  ██████████████████████████████████████████████████        █
                     █████████████████████████ ███  ██ █████   ███████████████████████████████████████████████████         
                    █████████████████████████  ███  ███ █████ █ ██████████████████████████████████████████████████         
                   ██████████████████████████   █████████████  ███████████████████████████████████████████████████         
                  █████████████████████████████ ████  ████████████████████████████████████████████████████████████         
                  ██████████████████████████████ ████ ██ █████████████████████████████████████████████████████████         
                 ████████████████████████████████ █████████████████████████████████████████████████████████████████        
                 █████████████████████████████████ ██████████████████████████████████████████████████████████████████      
                █████████████████████████████████████████████████████████████████████████████████████████████████████      
                ██████████████████████████████████████████████████████████████████████████████████████████████████████     
                █████████████████████████████████████████ ████████████████████████████████████████████████████████████     
                █████████████████████████████████████████ █████████████████████████████████████████████████████████████    
                ███████████████████████████████████████████████████████████████████████████████████████████████████████    
                ███████████████████████████████████████████████████████████████████████████████████████████████████████    
                ████████████████████████████████████████████████████████████████████████████████████████████████████████   
                ██████████████████████████████████  ████████████████████████████████████████████████████████████████████   `);
	}, []);
	return <></>;
};

export { Kirito };
