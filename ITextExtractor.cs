
namespace COOBOT.Util.WordExtractor
{
    public interface ITextExtractor
    {
        string ExtractText(byte[] pdfBytes);
    }
}
