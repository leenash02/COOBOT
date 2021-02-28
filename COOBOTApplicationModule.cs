using Abp.AutoMapper;
using Abp.Modules;
using Abp.Reflection.Extensions;
using COOBOT.Authorization;

namespace COOBOT
{
    [DependsOn(
        typeof(COOBOTCoreModule), 
        typeof(AbpAutoMapperModule))]
    public class COOBOTApplicationModule : AbpModule
    {
        public override void PreInitialize()
        {
            Configuration.Authorization.Providers.Add<COOBOTAuthorizationProvider>();
        }

        public override void Initialize()
        {
            var thisAssembly = typeof(COOBOTApplicationModule).GetAssembly();

            IocManager.RegisterAssemblyByConvention(thisAssembly);

            Configuration.Modules.AbpAutoMapper().Configurators.Add(
                // Scan the assembly for classes which inherit from AutoMapper.Profile
                cfg => cfg.AddMaps(thisAssembly)
            );
        }
    }
}
